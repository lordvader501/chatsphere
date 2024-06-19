import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Container from "@/components/layouts/Container";
import LoginLogoutForm from "../forms/LoginLogoutForm";

function LoginSignup({
  isLogin,
  pageDetails,
}: {
  isLogin: boolean;
  pageDetails: {
    title: string;
    description: string;
  };
}) {
  return (
    <Container>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{pageDetails.title}</CardTitle>
          <CardDescription>{pageDetails.description}</CardDescription>
        </CardHeader>
        <LoginLogoutForm isLogin={isLogin} />
      </Card>
    </Container>
  );
}

export default LoginSignup;
