"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Link,
  Avatar,
  Image,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Card, // Added Avatar import
} from "@heroui/react";
import NextLink from "next/link";

import { DynamicIcon } from "./DynamicIcons";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useUser } from "@/app/hooks/useUser";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { User } from "lucide-react";
export default function Header() {
  const { user } = useUser();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = useMemo(
    () => [
      { label: "Dashboard", href: "/dashboard", icon: "RxDashboard" },
      { label: "Documents", href: "/documents", icon: "BsFiles" },
      { label: "Profile", href: "/profile", icon: "FaUser" },
      { label: "Settings", href: "/settings", icon: "TbSettings2" },
    ],
    [],
  );
  const path = usePathname();

  const matchedLink =
    navLinks.find((link) => path.startsWith(link.href))?.href || "";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <Navbar
      className=" shadow-lg bg-linear-to-br from-purple-600 to-blue-500"
      maxWidth="2xl"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="lg:hidden cursor-pointer text-white"
      />
      <NavbarBrand>
        <Image
          src={"/assets/logo.png"}
          alt="logo"
          className="h-10 rounded-none sm:flex hidden"
        />
        <Image
          src={"/assets/logoMini.png"}
          alt="logo"
          className="h-10 sm:hidden rounded-none"
        />
      </NavbarBrand>

      {/* Main Navigation Links */}
      <NavbarContent className="hidden lg:flex gap-10" justify="center">
        {navLinks.map((link) => (
          <NavbarItem key={link.href}>
            <Link
              as={NextLink}
              href={link.href}
              color="foreground"
              className="text-white flex items-center justify-center gap-1 hover:opacity-80 transition-opacity"
            >
              <DynamicIcon iconName={link.icon} color="white" size={18} />
              <span>{link.label}</span>
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* User Profile Dropdown Logic */}
      <NavbarContent as="div" justify="end" className="gap-4">
        <ThemeSwitcher />

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform cursor-pointer"
              color="primary"
              size="sm"
              src={user?.avatar}
            />
          </DropdownTrigger>

          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              key="profile"
              className="gap-2 sm:hidden opacity-100"
              textValue="User Profile"
            >
              <div className="flex  items-center gap-2">
                <User size={20} />
                <div className="flex flex-col">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    {user?.name}
                  </p>
                  <p className="font text-foreground/70">{user?.email}</p>
                </div>
              </div>
            </DropdownItem>

            <DropdownItem key="help_and_feedback">
              <Link className="text-foreground text-sm" href={"/help-feedback"}>
                Help & Feedback
              </Link>
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              className="text-danger"
              onClick={handleLogout}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {/* Desktop User Info: Only shows on sm (640px) and up */}
        <div className="hidden sm:flex flex-col">
          <span className="text-base font-semibold text-white ">
            {user?.name}
          </span>
          <span className="text-xs text-white/70">{user?.email}</span>
        </div>
      </NavbarContent>

      {/* Mobile Navigation Links */}
      <NavbarMenu>
        {navLinks.map((link, index) => (
          <NavbarMenuItem key={`${link}-${index}`}>
            <Link
              className="w-full flex flex-col gap-2"
              href={link.href}
              // onClick={() => setActiveLink(link.href)}
              size="lg"
            >
              <Card
                className={`w-full flex flex-row  items-center  gap-2 justify-start border ${link.href === matchedLink ? "text-blue-700  border-blue-700" : "text-foreground"}  transition-colors duration-200  border-gray-200 dark:border-black/50  p-5`}
              >
                <DynamicIcon iconName={link.icon} color="" size={18} />
                <span>{link.label}</span>
              </Card>
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
