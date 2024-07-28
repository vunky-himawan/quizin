import { useAuth } from "@/context/authContext";
import { Navigate, Outlet } from "react-router-dom";

export const RouteForAuthOnly = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
