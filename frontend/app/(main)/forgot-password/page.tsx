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
import { requestResetPassApi } from "@/lib/apiscaller";
import React, { useState } from "react";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  async function handleReqResetPass() {
    try {
      const data = await requestResetPassApi(email);
      toast({
        description: data.message,
        variant: "success",
      });
    } catch (e) {
      console.error(e);
      toast({
        description: e + "",
        variant: "error",
      });
    }
  }
  return (
    <Container>
      <Card className="mx-auto max-w-sm mb-10" id="createroom">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password?</CardTitle>
          <CardDescription>
            Please enter your Email id to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="resetemail">Email Id</Label>
          <Input
            id="resetemail"
            placeholder="hello@example.com"
            value={email}
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Button className="w-full" onClick={handleReqResetPass}>
            Request reset password
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ForgotPasswordPage;
