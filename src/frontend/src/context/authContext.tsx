import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { createContext, useContext, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

const AuthContext = createContext({} as ContextType);

type ContextType = {
  token: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  refreshToken: () => void;
  username: string;
  axiosRefreshToken: AxiosInstance;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

interface JwtPayloadCustom extends JwtPayload {
  username: string;
  exp: number;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || null
  );
  const [username, setUsername] = useState<string>("");
  const [expiredIn, setExpiredIn] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const login = async (username: string, password: string) => {
    const data = { username, password };

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        data
      ); 

      setToken(response.data.accessToken as string);
      localStorage.setItem("token", response.data.accessToken);
    } catch (error) {
      setError(error.response.data.message as string);
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await axios.delete("http://localhost:3000/auth/logout").then(() => {
        localStorage.removeItem("token");
        setToken(null);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/refresh");

      const token = response.data.accessToken as string;

      localStorage.setItem("token", token);
      setToken(token as string);

      const decodedToken = jwtDecode<JwtPayloadCustom>(token);
      setUsername(decodedToken.username);
      setExpiredIn(decodedToken.exp);
    } catch (error) {
      console.log(error);
    }
  };

  const axiosRefreshToken: AxiosInstance = axios.create();

  axiosRefreshToken.interceptors.request.use(
    async (config): Promise<InternalAxiosRequestConfig> => {
      const currentDate = new Date();
      if (expiredIn * 1000 < currentDate.getTime()) {
        await refreshToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const context: ContextType = {
    token,
    login,
    error,
    logout,
    refreshToken,
    username,
    axiosRefreshToken,
    setError
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
