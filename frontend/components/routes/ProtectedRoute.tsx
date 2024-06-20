"use client";
import { useAppSelector } from "@/lib/store";
import { useRouter } from "next/navigation";
import React, { ComponentType, useEffect } from "react";

function ProtectedRoute<P extends Object>(WrappedComponent: ComponentType<P>) {
  return (props: P) => {
    const user = useAppSelector((state) => state.user.user);
    const router = useRouter();
    useEffect(() => {
      if (!user) {
        router.push("/login");
      }
    }, [user]);

    if (!user) {
      return null;
    }
    return <WrappedComponent {...props} />;
  };
}

export default ProtectedRoute;
