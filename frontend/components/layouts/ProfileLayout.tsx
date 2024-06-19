import React from "react";

function ProfileLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      ProfileLayout
      {children}
    </div>
  );
}

export default ProfileLayout;
