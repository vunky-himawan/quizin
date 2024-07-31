import IndexPage from "@/pages";
import AuthPage from "@/pages/auth";
import DashboardPage from "@/pages/dashboard";
import {
  createBrowserRouter,
  Navigate,
  RouteObject,
  RouterProviderProps,
} from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import { RouteForAuthOnly } from "./RouteForAuthOnly";
import QuestionPage from "@/pages/question";
import { useAuth } from "@/context/authContext";
import NotFoundPage from "@/pages/error";
import ResultPage from "@/pages/result";
import { ProtectedResultQuiz } from "./ProtectedResultQuiz";
import AuthGuard from "./AuthGuard";

const Routes = () => {
  const { token } = useAuth();

  const publicRoutes: RouteObject[] = [
    {
      path: "/",
      element: <IndexPage />,
    },
    {
      path: "/auth/:action",
      element: <AuthGuard />,
      children: [
        {
          path: "/auth/:action",
          element: <AuthPage />,
        },
      ],
    },
  ];

  const needAuthRoutes: RouteObject[] = [
    {
      path: "/user",
      element: <RouteForAuthOnly />,
      children: [
        {
          path: "/user/dashboard",
          element: <DashboardPage />,
        },
        {
          path: "/user/quiz",
          element: <QuestionPage />,
        },
        {
          path: "/user/quiz/result",
          element: <ProtectedResultQuiz />,
          children: [
            {
              path: "",
              element: <ResultPage />,
            },
          ],
        },
      ],
    },
  ];

  const routeCantAccessAfterLogin: RouteObject[] = [
    {
      path: "/",
      element: <Navigate to="/user/dashboard" />,
    },
    {
      path: "/login",
      element: <Navigate to="/user/dashboard" />,
    },
  ];

  const routes: RouteObject[] = [
    ...(token ? routeCantAccessAfterLogin : publicRoutes),
    ...needAuthRoutes,
    {
      path: "*",
      element: (
        <NotFoundPage
          code={404}
          message="Oops! The page you are looking for does not exist."
        />
      ),
    },
    {
      path: "/error",
      element: <NotFoundPage />,
    },
  ];

  const router: RouterProviderProps["router"] = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default Routes;
