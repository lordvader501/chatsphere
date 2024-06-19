"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import useForm from "@/lib/hooks/useForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/store/userSlice";
import { useSelector } from "react-redux";

function LoginLogoutForm({ isLogin }: { isLogin: boolean }) {
  const { email, username, password, confirmPassword, setForm } = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => (state as any).user.user);
  const router = useRouter();

  if (user) {
    router.push("/");
  }
  async function handleSigninSignup() {
    if (password !== confirmPassword && !isLogin) {
      console.log("password mismatch");
      return;
    }
    let user = username;
    if (isLogin) user = email;
    try {
      setLoading(true);
      const response = await fetch(process.env["BACKEND_URL"] + "/login", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          username: user,
          password: password,
        }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw Error(data.error);
      }
      dispatch(setUser(data.username));

      router.push("/");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardContent>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email{isLogin && "/User Name"}</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={(e) => setForm({ email: e.target.value })}
          />
        </div>
        {!isLogin && (
          <div className="grid gap-2">
            <Label htmlFor="email">Username</Label>
            <Input
              id="username"
              type="username"
              placeholder="Username"
              required
              onChange={(e) => setForm({ username: e.target.value })}
            />
          </div>
        )}
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {isLogin && (
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            )}
          </div>
          <Input
            id="password"
            type="password"
            onChange={(e) => setForm({ password: e.target.value })}
            required
          />
          {!isLogin && (
            <>
              <Label htmlFor="password2">Confirm Password</Label>
              <Input
                id="password2"
                type="password"
                onChange={(e) => setForm({ confirmPassword: e.target.value })}
                required
              />
            </>
          )}
        </div>
        <Button type="submit" className="w-full" onClick={handleSigninSignup}>
          {isLogin ? "Login" : "Sign up"}
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Link href={isLogin ? "/signup" : "/login"} className="underline">
          {isLogin ? "Sign up" : "Login"}
        </Link>
      </div>
    </CardContent>
  );
}

export default LoginLogoutForm;
