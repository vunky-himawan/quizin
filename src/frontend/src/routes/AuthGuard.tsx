import NotFoundPage from "@/pages/error";
import { Navigate, Outlet, useParams } from "react-router-dom";

const AuthGuard = () => {
  const { action } = useParams();
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
