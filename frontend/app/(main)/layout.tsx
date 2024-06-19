import Layout from "@/components/layouts/MainLayout";

function MainLayout({ children }: { children: React.ReactNode }) {
  return <Layout classNames="">{children}</Layout>;
}
export default MainLayout;
