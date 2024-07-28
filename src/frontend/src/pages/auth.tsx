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
import { useAuth } from "@/context/authContext";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = {
        username,
        password,
      };

      if (data.username.trim() === "" || data.password.trim() === "") {
        alert("Username dan password tidak boleh kosong");
      }

      await login(data.username, data.password);
      navigate("/user/dashboard");
    } catch (error) {
      console.error("Error while login", error);
    }
  };

  return (
    <>
      <main>
        <section className="w-full h-screen flex justify-center items-center">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-80"
            method="post"
          >
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Login to your account</CardDescription>
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
              </CardContent>
              <CardFooter className="flex justify-end gap-4">
                <Button type="submit">Login</Button>
              </CardFooter>
            </Card>
          </form>
        </section>
      </main>
    </>
  );
};

export default AuthPage;
