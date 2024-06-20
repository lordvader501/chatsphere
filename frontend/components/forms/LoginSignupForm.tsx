"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import useForm from "@/lib/hooks/useForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setUser } from "@/lib/store/userSlice";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { loginUserApi, signupUserApi } from "@/lib/apiscaller";
import { useAppDispatch, useAppSelector } from "@/lib/store";

function LoginSignupForm({ isLogin }: { isLogin: boolean }) {
  const { email, username, password, confirmPassword, setForm } = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const { toast } = useToast();

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
      let data;
      if (isLogin) {
        data = await loginUserApi(user, password);
        dispatch(setUser(data.username));
      } else {
        data = await signupUserApi(email, username, password);
      }
      toast({
        description: data.message,
        variant: "success",
      });
      if (!isLogin) {
        toast({
          description: "Verification mail has been sent. Please verify!",
          variant: "warning",
        });
      }
      router.push(isLogin ? "/" : "/login");
    } catch (e) {
      console.error(e);
      toast({
        title: "Uh Oh! Something wrong happened!",
        description: e + "",
        variant: "error",
      });
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
          {buttonText(loading, isLogin)}
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

export default LoginSignupForm;

function buttonText(
  loading: boolean,
  isLogin: boolean
): string | React.ReactNode {
  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-[18px] w-[18px] animate-spin" />
        Please wait
      </div>
    );
  if (isLogin) return "Log In";
  return "Sign Up";
}
