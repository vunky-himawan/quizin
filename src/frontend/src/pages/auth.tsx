import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/authContext";
import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

/**
 * @component AuthPage
 * @description Halaman auth untuk pengguna login atau register.
 * @returns {JSX.Element} - Halaman auth.
 */
const AuthPage = () => {
  // Mengambil action dari parameter.
  const { action } = useParams();

  return (
    <>
      <main>
        <section className="w-full h-screen flex justify-center items-center">
          {action === "login" ? <FormLogin /> : <FormRegister />}
        </section>
      </main>
    </>
  );
};

/**
 * @component FormRegister
 * @description Form untuk pengguna register.
 * @returns {JSX.Element} - Form untuk pengguna register.
 */
const FormRegister = () => {
  // Mengambil dan menyimpan nilai username dari input.
  const [username, setUsername] = useState("");

  // Mengambil dan menyimpan nilai password dari input.
  const [password, setPassword] = useState("");

  // Mengambil dan menyimpan nilai confirmPassword dari input.
  const [confirmPassword, setConfirmPassword] = useState("");

  // Mengambil konteks autentikasi.
  const { register, error, setError } = useAuth();

  // Mengambil ref dari form.
  const formRef = useRef<HTMLFormElement>(null);

  // Inisialisasi fungsi untuk navigasi.
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * @function handleRegister
   * @description Fungsi untuk mendaftarkan pengguna baru.
   * @param {React.FormEvent<HTMLFormElement>} e - Event form.
   */
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Password and confirm password must be the same");
      return;
    }

    const data = {
      username,
      password,
    };

    if (data.username.trim() === "" || data.password.trim() === "") {
      setError("Username or password is empty");
      return;
    }

    try {
      await register(data.username, data.password);

      toast({
        title: `User ${data.username} registered successfully`,
        description: "Please wait...",
        duration: 1800,
        className: "bg-green-500 text-white",
      });

      navigate("/auth/login");
    } catch (error) {
      setError(error as string);
    }
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleRegister}
        className="w-80"
        method="post"
      >
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create an account</CardDescription>
            {error && (
              <CardDescription className="text-red-500">
                {error}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                id="username"
                name="username"
                placeholder="Username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                placeholder="Password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-blue-500 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button type="submit">Register</Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

/**
 * @component FormLogin
 * @description Form untuk pengguna login.
 * @returns {JSX.Element} - Form untuk pengguna login.
 */
const FormLogin = () => {
  // Mengambil dan menyimpan nilai username dari input.
  const [username, setUsername] = useState("");

  // Mengambil dan menyimpan nilai password dari input.
  const [password, setPassword] = useState("");

  // Mengambil konteks autentikasi.
  const { login, error, setError } = useAuth();

  // Mengambil ref dari form.
  const formRef = useRef<HTMLFormElement>(null);

  // Inisialisasi fungsi untuk navigasi.
  const navigate = useNavigate();

  /**
   * @function handleLogin
   * @description Fungsi untuk melakukan login pengguna.
   * @param {React.FormEvent<HTMLFormElement>} e - Event form.
   */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      username,
      password,
    };

    if (data.username.trim() === "" || data.password.trim() === "") {
      setError("Username dan password tidak boleh kosong");
      return;
    }

    try {
      await login(data.username, data.password);

      toast({
        title: `Logged in as ${data.username}`,
        description: "Please wait...",
        duration: 1800,
        className: "bg-green-500 text-white",
      });

      navigate("/user/dashboard");
    } catch (error) {
      setError(error as string);
    }
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleLogin} className="w-80" method="post">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Login to your account</CardDescription>
            {error && (
              <CardDescription className="text-red-500">
                {error}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                id="username"
                name="username"
                placeholder="Username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                placeholder="Password"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/auth/register"
                  className="text-blue-500 hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button type="submit">Login</Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default AuthPage;
