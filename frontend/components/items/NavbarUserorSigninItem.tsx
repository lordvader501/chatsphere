"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { CircleUser } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { clearUser } from "@/lib/store/userSlice";

function NavbarUserorSigninItem() {
  const dispatch = useDispatch();
  const user = useSelector((state) => (state as any).user.user);

  async function handleLogout() {
    try {
      const response = await fetch(process.env["BACKEND_URL"] + "/logout", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      dispatch(clearUser());
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
      {user ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Link href="/login">
          <Button variant="default" size="sm">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
}

export default NavbarUserorSigninItem;
