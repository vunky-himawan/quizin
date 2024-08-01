import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { createContext, useContext, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

const AuthContext = createContext({} as ContextType);

// Type data konteks autentikasi.
type ContextType = {
  token: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  refreshToken: () => void;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  axiosRefreshToken: AxiosInstance;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  register: (username: string, password: string) => void;
};

// Type data payload dari token autentikasi.
interface JwtPayloadCustom extends JwtPayload {
  username: string;
  exp: number;
}

/**
 * @function AuthProvider
 * @description Menyediakan konteks autentikasi untuk aplikasi.
 * @param {React.ReactNode} children - Komponen child yang akan menerima konteks autentikasi.
 * @returns {JSX.Element} - Penyedia konteks autentikasi yang membungkus komponen anak.
 */
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Mengambil dan menyimpan nilai token dari localStorage.
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || null
  );

  // Mengambil dan menyimpan nilai username dari localStorage.
  const [username, setUsername] = useState<string>("");

  // Mengambil dan menyimpan nilai expiredIn dari localStorage.
  const [expiredIn, setExpiredIn] = useState<number>(0);

  // Mengambil dan menyimpan nilai error yang terjadi.
  const [error, setError] = useState<string>("");

  /**
   * @function login
   * @description Fungsi untuk login pengguna.
   * @param {string} username - Username pengguna.
   * @param {string} password - Password pengguna.
   */
  const login = async (username: string, password: string) => {
    const data = { username, password };

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        data
      );

      setError("");

      setToken(response.data.accessToken as string);
      localStorage.setItem("token", response.data.accessToken);
      const decodedToken = jwtDecode<JwtPayloadCustom>(
        response.data.accessToken
      );

      setUsername(decodedToken.username as string);
      localStorage.setItem(
        `X-USERNAME-${decodedToken.username}`,
        decodedToken.username
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data.message;
      } else {
        throw "An unexpected error occurred";
      }
    }
  };

  /**
   * @function logout
   * @description Fungsi untuk logout pengguna.
   */
  const logout = async () => {
    try {
      await axios.delete("http://localhost:3000/auth/logout").then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem(`X-USERNAME-${username}`);
        setToken(null);
      });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @function refreshToken
   * @description Fungsi untuk refresh token pengguna.
   */
  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/refresh");

      const token = response.data.accessToken as string;

      localStorage.setItem("token", token);
      setToken(token as string);

      const decodedToken = jwtDecode<JwtPayloadCustom>(token);

      setUsername(
        localStorage.getItem(`X-USERNAME-${decodedToken.username}`) as string
      );

      localStorage.setItem(
        `X-USERNAME-${decodedToken.username}`,
        decodedToken.username
      );
      setExpiredIn(decodedToken.exp);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @function register
   * @description Fungsi untuk register pengguna baru.
   * @param {string} username - Username pengguna baru.
   * @param {string} password - Password pengguna baru.
   * @returns {Promise<{ status: number }>} - Mengembalikan status HTTP.
   */
  const register = async (
    username: string,
    password: string
  ): Promise<{ status: number }> => {
    const data = { username, password };

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        data
      );

      setError("");

      return { status: response.status };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data.message;
      } else {
        throw "An unexpected error occurred";
      }
    }
  };

  // Membuat axios instance yang memperbarui token.
  const axiosRefreshToken: AxiosInstance = axios.create();

  // Interceptor untuk memperbarui token.
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
    setUsername,
    error,
    logout,
    refreshToken,
    username,
    axiosRefreshToken,
    setError,
    register,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

/**
 * @function useAuth
 * @description Hook untuk menggunakan konteks autentikasi.
 * @returns {ContextType} - Mengembalikan konteks autentikasi.
 */
export const useAuth = () => useContext(AuthContext);
