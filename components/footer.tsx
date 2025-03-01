import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-[#020817]">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="IT Club Logo"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold">IT Club</span>
            </Link>
            <p className="mt-3 text-sm text-[#94a3b8]">
              Empowering students to innovate and excel in the world of
              technology.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-[#94a3b8] hover:text-[#f8fafc]">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-[#94a3b8] hover:text-[#f8fafc]">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-[#94a3b8] hover:text-[#f8fafc]">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-[#94a3b8] hover:text-[#f8fafc]">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-[#94a3b8] hover:text-[#f8fafc]">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-[#94a3b8] hover:text-[#f8fafc]">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  News
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/resources"
                  className="text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  Learning Materials
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/workshops"
                  className="text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  Workshops
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-[#94a3b8]">
                University Campus, Building 4, Room 204
              </li>
              <li>
                <a
                  href="mailto:contact@itclub.edu"
                  className="text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  contact@itclub.edu
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-4 text-center text-sm text-[#94a3b8]">
          <p>
            &copy; {new Date().getFullYear()} College IT Club. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
