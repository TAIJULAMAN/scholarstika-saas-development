"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { FaTiktok, FaYoutube } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-amber-500 py-12 text-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Scholarstika Logo"
                width={180}
                height={50}
                className="h-12 w-auto"
              />
            </div>
            <h3 className="mb-3 text-lg font-bold text-white">
              Multi-Tenant School Management
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-[#1B2149]">
              A scalable, cloud-based platform that helps schools manage
              academics, administration, communication, and finance — all under
              one unified multi-tenant system.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <Link
                href="https://www.facebook.com/profile.php?id=61584135701063"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition-all hover:bg-white/30"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="https://x.com/scholarstika_"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition-all hover:bg-white/30"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.tiktok.com/@scholarstika_acs"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition-all hover:bg-white/30"
              >
                <FaTiktok className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.youtube.com/@ScholarstikaUSA"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition-all hover:bg-white/30"
              >
                <FaYoutube className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="mb-4 text-lg text-white font-bold">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href=""
                  className="text-[#1B2149] transition-colors hover:text-white"
                >
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="text-[#1B2149] transition-colors hover:text-white"
                >
                  School Admin Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#1B2149] transition-colors hover:text-white"
                >
                  Teacher Portal
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#1B2149] transition-colors hover:text-white"
                >
                  Student Portal
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#1B2149] transition-colors hover:text-white"
                >
                  Parent Portal
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#1B2149] transition-colors hover:text-white"
                >
                  Attendance & Exams
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-[#1B2149] transition-colors hover:text-white"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-lg text-white font-bold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-[#1B2149] transition-colors hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-[#1B2149] transition-colors hover:text-white"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#1B2149] transition-colors hover:text-white"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[#1B2149] transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[#1B2149] transition-colors hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-[#1B2149] transition-colors hover:text-white"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className="text-[#1B2149] transition-colors hover:text-white"
                >
                  Testimonials
                </Link>

              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="mb-4 text-lg text-white font-bold">Contact</h3>
            <ul className="mb-6 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <a
                  href="mailto:admin@scholarstika.org"
                  className="text-[#1B2149] hover:text-white"
                >
                  admin@scholarstika.org
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className="text-[#1B2149]">+1 614-377-0445</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className="text-[#1B2149]">Reynoldsburg, Ohio, USA</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className="text-[#1B2149]">
                  Need Help? Our support team is available 24/7.
                </span>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className="mb-3 text-sm text-white font-bold">
                Subscribe to Newsletter
              </h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white focus:bg-white/30"
                />
                <Button
                  size="icon"
                  className="bg-white text-amber-500 hover:bg-white/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-[#1B2149]">
              © 2026 Multi-Tenant School Management System. All rights reserved.
            </p>
            <p className="text-sm text-[#1B2149]">
              Made with ❤️ for Schools & Education
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
