import { useAuth } from "@/context/authContext";
import { Navigate, Outlet } from "react-router-dom";

export const RouteForAuthOnly = () => {
  const { token, error } = useAuth();

  if (error) {
    return <Navigate to="/login" />;
  }

  if (!token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
