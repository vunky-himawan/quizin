import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

/**
 * @component NotFoundPage
 * @description Halaman error untuk pengguna yang memasukkan URL yang tidak ada.
 * @returns {JSX.Element} - Halaman error.
 */
const NotFoundPage = ({
  code,
  message,
}: {
  code?: number;
  message?: string;
}) => {
  // Mengambil location dari hook useLocation.
  const location = useLocation();

  // Mengambil errorCode dan errorMessage dari location.
  const {
    errorCode,
    errorMessage,
  }: { errorCode: number; errorMessage: string } = location.state || {
    errorCode: 404,
    errorMessage: "Oops! The page you are looking for does not exist.",
  };

  return (
    <>
      <main className="h-screen w-screen max-w-7xl mx-auto p-5">
        <section className="flex flex-col items-center justify-center h-full gap-10">
          <h1 className="text-4xl font-bold">{`${errorCode || code}`}</h1>
          <p className="text-xl text-center">{message || errorMessage}</p>
          <Link to="/">
            <Button className="bg-sky-500 w-fit">Go Home</Button>
          </Link>
        </section>
      </main>
    </>
  );
};

export default NotFoundPage;
