"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import React, { ComponentType, useEffect } from "react";

function ProtectedRoute(WrappedComponent: ComponentType) {
  return (props: any) => {
    const user = useSelector((state) => (state as any).user.user);
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
