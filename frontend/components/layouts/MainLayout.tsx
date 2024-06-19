import React from "react";
import NavbarComponent from "../navigation/Navbar";
import Footer from "../footer/Footer";

function MainLayout({
  children,
  classNames = "",
}: {
  children: React.ReactNode;
  classNames: string;
}) {
  return (
    <div className={classNames}>
      <NavbarComponent />
      {children}
      {/* <Footer /> */}
    </div>
  );
}

export default MainLayout;
