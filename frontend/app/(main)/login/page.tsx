import LoginSignup from "@/components/pages/LoginSignup";

function LoginPage() {
  const pageDetails = {
    title: "Login",
    description: "Enter your email below to login to your account",
  };
  return <LoginSignup isLogin={true} pageDetails={pageDetails} />;
}

export default LoginPage;
