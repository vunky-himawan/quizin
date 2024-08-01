import { useAuth } from "@/context/authContext";
import { Navigate, Outlet } from "react-router-dom";

/**
 * @component RouteForAuthOnly
 * @description Guard untuk memastikan pengguna hanya bisa mengakses halaman yang memerlukan autentikasi.
 * @returns {JSX.Element} - Mengembalikan halaman yang akan ditampilkan sesuai dengan action.
 */
export const RouteForAuthOnly = () => {
  const { token, error } = useAuth();

  if (error) {
    return <Navigate to="/auth/login" />;
  }

  if (!token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
