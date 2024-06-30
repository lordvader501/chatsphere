"use client";
import Container from "@/components/layouts/Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { resetPassApi } from "@/lib/apiscaller";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

function ResetPasswordPage() {
  const [password, setPassword] = useState({ newpass: "", confnewpass: "" });
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  if (!token) {
    toast({
      description: "Invalid token provided!",
      variant: "warning",
    });
    router.push("/");
  }
  async function handleResetPass() {
    if (password.newpass !== password.confnewpass) {
      toast({
        description: "New password and confirm new password are not matching!",
        variant: "warning",
      });
      return;
    }
    if (token) {
      try {
        const data = await resetPassApi(password.newpass, token);
        toast({
          description: data.message,
          variant: "success",
        });
        router.push("/login");
      } catch (e) {
        console.error(e);
        toast({
          description: e + "",
          variant: "error",
        });
      }
    }
  }
  return (
    <Container>
      <Card className="mx-auto max-w-sm mb-10" id="createroom">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Please enter a new password and confirm new password to reset your
            password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="newpassword">New Password</Label>
          <Input
            id="newpassword"
            placeholder="New Password"
            value={password.newpass}
            type="password"
            required
            onChange={(e) =>
              setPassword({ ...password, newpass: e.target.value })
            }
            className="mb-4"
          />
          <Label htmlFor="newconfpassword">Confirm New Password</Label>
          <Input
            id="newconfpassword"
            placeholder="Confirm New Password"
            value={password.confnewpass}
            type="password"
            required
            onChange={(e) =>
              setPassword({ ...password, confnewpass: e.target.value })
            }
            className="mb-4"
          />
          <Button className="w-full" onClick={handleResetPass}>
            Reset password
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ResetPasswordPage;
