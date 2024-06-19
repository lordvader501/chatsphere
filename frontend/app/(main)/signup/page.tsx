import LoginSignup from "@/components/pages/LoginSignup";

function SignupPage() {
  const pageDetails = {
    title: "Sign Up",
    description: "Enter your email and password to create an account",
  };
  return <LoginSignup isLogin={false} pageDetails={pageDetails} />;
}

export default SignupPage;
