import Layout from "@/components/layouts/MainLayout";

import React from "react";

function MainLayout({ children }: { children: React.ReactNode }) {
  return <Layout classNames="h-[100vh]">{children}</Layout>;
}

export default MainLayout;
