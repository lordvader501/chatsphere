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
import { clearUser } from "@/lib/store/userSlice";
import { logoutUserApi } from "@/lib/apiscaller";
import { useToast } from "../ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store";

function NavbarUserorSigninItem() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const user = useAppSelector((state) => (state as any).user.user);

  const navMenuItems = [
    { name: "Profile", link: "/profile" },
    { name: "Rooms", link: "/my-rooms" },
    { name: "Support", link: "/support" },
  ];

  async function handleLogout() {
    try {
      const data = await logoutUserApi();
      toast({
        description: "You have been logged out.",
        variant: "success",
      });
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
              <DropdownMenuLabel>{user}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navMenuItems.map((item) => (
                <Link href={item.link} key={item.name}>
                  <DropdownMenuItem>{item.name}</DropdownMenuItem>
                </Link>
              ))}
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
