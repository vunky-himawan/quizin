import NotFoundPage from "@/pages/error";
import { Outlet, useParams } from "react-router-dom";

/**
 * @component AuthGuard
 * @description Guard untuk memastikan pengguna hanya bisa mengakses halaman /auth/login dan /auth/register.
 * @returns {JSX.Element} - Mengembalikan halaman yang akan ditampilkan sesuai dengan action.
 */
const AuthGuard = () => {
  // Mengambil action dari parameter.
  const { action } = useParams();

  // Action yang valid.
  const validActions = ["login", "register"];

  if (!validActions.includes(action as string)) {
    return (
      <NotFoundPage
        code={404}
        message="Oops! The page you are looking for does not exist."
      />
    );
  }

  return <Outlet />;
};

export default AuthGuard;
