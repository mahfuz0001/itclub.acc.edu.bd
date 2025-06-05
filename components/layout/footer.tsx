import Link from "next/link";
import { SITE_CONFIG } from "@/constants/site";
import { SOCIAL_LINKS } from "@/constants/links";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">{SITE_CONFIG.name}</h3>
            <p className="text-sm text-[#94a3b8]">{SITE_CONFIG.description}</p>
            <div className="flex space-x-3">
              <Link
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#94a3b8] hover:text-[#74bf45]"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#94a3b8] hover:text-[#74bf45]"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#94a3b8] hover:text-[#74bf45]"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#94a3b8] hover:text-[#74bf45]"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#about"
                  className="text-[#94a3b8] hover:text-[#74bf45]"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#news"
                  className="text-[#94a3b8] hover:text-[#74bf45]"
                >
                  News
                </Link>
              </li>
              <li>
                <Link
                  href="/#gallery"
                  className="text-[#94a3b8] hover:text-[#74bf45]"
                >
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/join"
                  className="text-[#94a3b8] hover:text-[#74bf45]"
                >
                  Join the Club
                </Link>
              </li>
              <li>
                <Link
                  href="/#events"
                  className="text-[#94a3b8] hover:text-[#74bf45]"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/#projects"
                  className="text-[#94a3b8] hover:text-[#74bf45]"
                >
                  Projects
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Contact</h3>
            <address className="not-italic text-sm text-[#94a3b8]">
              <p>{SITE_CONFIG.address.line1}</p>
              {/* <p>{SITE_CONFIG.address.line2}</p> */}
              <p>
                {SITE_CONFIG.address.city} - {SITE_CONFIG.address.zip}
              </p>
              <p className="mt-2">
                Email:{" "}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="hover:text-[#74bf45]"
                >
                  {SITE_CONFIG.email}
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="hover:text-[#74bf45]"
                >
                  {SITE_CONFIG.phone}
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-[#94a3b8]">
          <p>
            &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
