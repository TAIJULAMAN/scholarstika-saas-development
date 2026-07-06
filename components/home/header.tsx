"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Search,
  Facebook,
  Instagram,
  Twitter,
  LogOut,
  Youtube,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaTiktok } from "react-icons/fa";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useUser();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full h-full font-sans">
      {/* Top Row - Social Icons and Action Buttons */}
      <div className="bg-emerald-950 text-white shadow-sm">
        <div className="container mx-auto flex h-12 items-center justify-between px-5 md:px-0">
          {/* Social Icons - Left */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="https://www.facebook.com/profile.php?id=61584135701063"
              target="_blank"
              className="rounded-full p-2 text-emerald-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Facebook className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="https://x.com/scholarstika_"
              target="_blank"
              className="rounded-full p-2 text-emerald-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Twitter className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="https://www.tiktok.com/@scholarstika_acs"
              target="_blank"
              className="rounded-full p-2 text-emerald-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <FaTiktok className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="https://www.youtube.com/@ScholarstikaUSA"
              target="_blank"
              className="rounded-full p-2 text-emerald-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Youtube className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>

          {/* Empty space for mobile */}
          <div className="md:hidden"></div>

          {/* Action Buttons - Right */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              asChild
              variant="ghost"
              className="h-8 rounded-full text-xs font-semibold text-emerald-100 hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">Request Information</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-8 rounded-full text-xs font-semibold text-emerald-100 hover:bg-white/10 hover:text-white"
            >
              <Link href="/auth/signin">Student Hub</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-md p-2 text-emerald-100 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Row - Logo, Navigation, Auth */}
      <div className="border-b border-emerald-100 bg-white/95 backdrop-blur-md shadow-sm transition-all">
        <div className="container mx-auto flex items-center justify-between px-5 py-4 md:px-0">
          {/* Left - Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="Scholastika Logo"
              width={120}
              height={40}
              // fill
              className="h-20 w-42 md:w-full md:h-26"
              priority
            />
          </Link>

          {/* Middle - Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 xl:px-5 xl:text-xl"
            >
              Home
            </Link>
            <Link
              href="/features"
              className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 xl:px-5 xl:text-xl"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 xl:px-5 xl:text-xl"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 xl:px-5 xl:text-xl"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 xl:px-5 xl:text-xl"
            >
              Contact
            </Link>
            <Link
              href="/testimonials"
              className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 xl:px-5 xl:text-xl"
            >
              Testimonials
            </Link>
          </nav>

          {/* Right - Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-gray-100 bg-white p-1 pr-3 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <Avatar className="h-8 w-8 border border-gray-100">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start px-1">
                      <span className="text-xs font-semibold text-gray-700 leading-none">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wide leading-none mt-0.5">
                        {user.role === "institution_manager"
                          ? "Global Admin"
                          : user.role === "branch_manager" || user.role === "branch_admin"
                            ? "Branch Admin"
                            : user.role.replace("_", " ")}
                      </span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={
                        {
                          student: "/student/dashboard",
                          parent: "/parent/dashboard",
                          teacher: "/teacher/dashboard",
                          branch_manager: "/branch/dashboard",
                          branch_admin: "/branch/dashboard",
                          institution_manager: "/institution/dashboard",
                          bursar: "/bursar/dashboard",
                          nurse: "/nurse",
                        }[user.role] || "/dashboard"
                      }
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="rounded-full px-5 py-2.5 text-xl font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-full bg-emerald-600 px-6 py-2.5 text-xl font-bold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-95"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-12 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <nav className="fixed left-0 right-0 top-12 z-50 h-[calc(100vh-3rem)] overflow-y-auto bg-white/95 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-4 p-6">
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="group flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/features"
                  className="group flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className="group flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/about"
                  className="group flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="group flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>

              {/* Divider */}
              <div className="my-2 border-t border-gray-100" />

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/signin"
                  className="flex w-full items-center justify-center rounded-full bg-gray-100 px-4 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>

              {/* Secondary Actions */}
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Link
                  href="/contact"
                  className="flex items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Request Info
                </Link>
                <Link
                  href="/auth/signin"
                  className="flex items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Student Hub
                </Link>
              </div>

              {/* Social Icons */}
              <div className="mt-4 flex items-center justify-center gap-6 text-gray-400">
                <button className="transition-colors hover:text-emerald-600">
                  <Search className="h-5 w-5" strokeWidth={2.5} />
                </button>
                <button className="transition-colors hover:text-emerald-600">
                  <Facebook className="h-5 w-5" strokeWidth={2.5} />
                </button>
                <button className="transition-colors hover:text-emerald-600">
                  <Instagram className="h-5 w-5" strokeWidth={2.5} />
                </button>
                <button className="transition-colors hover:text-emerald-600">
                  <Twitter className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
