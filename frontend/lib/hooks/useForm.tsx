import React, { useState } from "react";

interface FormValues {
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
}

function useForm() {
  const [formValue, setFormValue] = useState<FormValues>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const setForm = (value: Partial<FormValues>) => {
    setFormValue({ ...formValue, ...value });
  };

  const email = formValue?.email;
  const username = formValue?.username;
  const password = formValue?.password;
  const confirmPassword = formValue?.confirmPassword;

  return { email, username, password, confirmPassword, setForm };
}

export default useForm;
