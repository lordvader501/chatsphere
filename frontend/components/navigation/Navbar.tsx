import Link from "next/link";
import { Menu, Keyboard } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavbarUserorSigninItem from "../items/NavbarUserorSigninItem";

function NavbarComponent() {
  return (
    <div className="flex justify-center items-center w-full flex-col border-b sticky top-0 h-16">
      <header className="sticky top-0 w-full max-w-[1280px] flex h-16 items-center gap-4 bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Keyboard className="h-6 w-6" />
            <span className="sr-only">ChatSphere Inc</span>
          </Link>
          <Link
            href="/"
            className="text-muted-foreground whitespace-nowrap transition-colors hover:text-foreground"
            aria-label="Home"
          >
            Home
          </Link>
          <Link
            href="/chat"
            className="text-muted-foreground whitespace-nowrap transition-colors hover:text-foreground"
            aria-label="Chat Room"
          >
            Chat Room
          </Link>
          <Link
            href="about-us"
            className="text-muted-foreground whitespace-nowrap transition-colors hover:text-foreground"
            aria-label="About Us"
          >
            About Us
          </Link>
          <Link
            href="contact-us"
            className="text-muted-foreground whitespace-nowrap transition-colors hover:text-foreground"
            aria-label="Contact Us"
          >
            Contact Us
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
                aria-label="ChatSphere Inc"
              >
                <Keyboard className="h-6 w-6" />
                <span className="sr-only">ChatSphere Inc</span>
              </Link>
              <Link
                href="/"
                className="text-muted-foreground whitespace-nowrap hover:text-foreground"
                aria-label="Home"
              >
                Home
              </Link>
              <Link
                href="/chat"
                className="text-muted-foreground whitespace-nowrap hover:text-foreground"
                aria-label="Chat Room"
              >
                Chat Room
              </Link>
              <Link
                href="about-us"
                className="text-muted-foreground whitespace-nowrap hover:text-foreground"
                aria-label="About Us"
              >
                About Us
              </Link>
              <Link
                href="contact-us"
                className="text-muted-foreground whitespace-nowrap hover:text-foreground"
                aria-label="Contact Us"
              >
                Contact Us
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <NavbarUserorSigninItem />
      </header>
    </div>
  );
}

export default NavbarComponent;
