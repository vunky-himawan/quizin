import { useAuth } from "@/context/authContext";
import { Button } from "./button";

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="flex justify-between items-center w-full h-fit bg-white shadow-sm fixed top-0 left-0 right-0 p-5">
      <h2 className="text-2xl font-semibold">Quizin</h2>
      <Button onClick={logout} className="bg-red-500">
        Logout
      </Button>
    </header>
  );
};

export default Header;
