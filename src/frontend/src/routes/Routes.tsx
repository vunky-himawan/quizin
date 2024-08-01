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
import { QuizGuard } from "./QuizGuard";

/**
 * @component Routes
 * @description Routing aplikasi.
 * @returns {JSX.Element} - Mengembalikan halaman yang akan ditampilkan sesuai dengan action.
 */
const Routes = () => {
  // Mengambil token dari context.
  const { token } = useAuth();

  // Route publik.
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
          path: "",
          element: <AuthPage />,
        },
      ],
    },
  ];

  // Route yang memerlukan autentikasi.
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
          element: <QuizGuard />,
          children: [
            {
              path: "",
              element: <QuestionPage />,
            },
          ],
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

  // Route yang tidak bisa diakses setelah login.
  const routeCantAccessAfterLogin: RouteObject[] = [
    {
      path: "/",
      element: <Navigate to="/user/dashboard" />,
    },
    {
      path: "/auth/:action",
      element: <Navigate to="/user/dashboard" />,
    },
  ];

  // Menggabungkan semua route.
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

  // Membuat router.
  const router: RouterProviderProps["router"] = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default Routes;
