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
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const AuthPage = () => {
  const { action } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (action !== "login" && action !== "register") {
      navigate("/");
    }
  }, [action]);

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

const FormRegister = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, error, setError } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");

      if (password !== confirmPassword) {
        setError("Password and confirm password must be the same");
        return;
      }

      const data = {
        username,
        password,
      };

      if (data.username.trim() === "" || data.password.trim() === "") {
        alert("Username or password is empty");
      }

      const response = await register(data.username, data.password);

      if (response.status === 200) {
        toast({
          title: `User ${data.username} registered successfully`,
          description: "Please wait...",
          duration: 1800,
          className: "bg-green-500 text-white",
        });

        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Error while login", error);
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

const FormLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, setError } = useAuth();

  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = {
        username,
        password,
      };

      if (data.username.trim() === "" || data.password.trim() === "") {
        alert("Username dan password tidak boleh kosong");
      }

      setError("");

      await login(data.username, data.password);

      toast({
        title: `Logged in as ${data.username}`,
        description: "Please wait...",
        duration: 1800,
        className: "bg-green-500 text-white",
      });

      navigate("/user/dashboard");
    } catch (error) {
      console.error("Error while login", error);
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
