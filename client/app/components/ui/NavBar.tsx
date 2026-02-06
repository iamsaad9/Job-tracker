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
  Image, // Added Avatar import
} from "@heroui/react";
import NextLink from "next/link";

import { DynamicIcon } from "./DynamicIcons";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useUser } from "@/app/hooks/useUser";
import { useRouter } from "next/navigation";
export default function Header() {
  const { user } = useUser();
  const router = useRouter();
  const navLinks = [
    { label: "Dashboard", href: "/dashboard", icon: "RxDashboard" },
    { label: "Documents", href: "/documents", icon: "BsFiles" },
    { label: "Profile", href: "/profile", icon: "FaUser" },
    { label: "Settings", href: "/settings", icon: "TbSettings2" },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <Navbar
      className=" shadow-lg bg-gradient-to-br from-purple-600 to-blue-500"
      maxWidth="2xl"
    >
      <NavbarBrand>
        <Image src="/assets/logo.png" alt="logo" className="h-12" />
      </NavbarBrand>

      {/* Main Navigation Links */}
      <NavbarContent className="hidden sm:flex gap-10" justify="center">
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
            {/* Mobile User Info: Only shows when the screen is smaller than sm */}
            <DropdownItem
              key="profile"
              className="h-14 gap-2 sm:hidden opacity-100"
              textValue="User Profile"
            >
              <div className="flex flex-col">
                <p className="font-semibold text-white">Signed in as</p>
                <p className="font-semibold text-white">{user?.name}</p>
              </div>
            </DropdownItem>

            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
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
    </Navbar>
  );
}
