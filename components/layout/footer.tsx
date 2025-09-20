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
            
            {/* Featured Facebook Page Link */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Link
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group"
              >
                <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold text-sm">Follow Our Page</div>
                  <div className="text-xs opacity-80">Latest updates & events</div>
                </div>
              </Link>
            </div>

            {/* Other Social Links */}
            <div className="flex space-x-3">
              {[
                SOCIAL_LINKS.twitter,
                SOCIAL_LINKS.instagram,
                SOCIAL_LINKS.linkedin,
              ].map((link, i) => {
                const Icon = [Twitter, Instagram, Linkedin][i];
                return (
                  <Link
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#94a3b8] hover:text-[#74bf45] hover:drop-shadow-[0_0_6px_#74bf45] transition-all duration-300"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">Social</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {["About Us", "News", "Gallery"].map((text, i) => (
                <li key={i}>
                  <Link
                    href={["/#about", "/#news", "/#gallery"][i]}
                    className="text-[#94a3b8] hover:text-[#74bf45] hover:drop-shadow-[0_0_6px_#74bf45] transition-all duration-300"
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              {["Join the Club", "Events", "Projects"].map((text, i) => (
                <li key={i}>
                  <Link
                    href={["/join", "/#events", "/#projects"][i]}
                    className="text-[#94a3b8] hover:text-[#74bf45] hover:drop-shadow-[0_0_6px_#74bf45] transition-all duration-300"
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Contact</h3>
            <address className="not-italic text-sm text-[#94a3b8]">
              <p>{SITE_CONFIG.address.line1}</p>
              <p>
                {SITE_CONFIG.address.city} - {SITE_CONFIG.address.zip}
              </p>
              <p className="mt-2">
                Email:{" "}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="hover:text-[#74bf45] hover:drop-shadow-[0_0_6px_#74bf45] transition-all duration-300"
                >
                  {SITE_CONFIG.email}
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="hover:text-[#74bf45] hover:drop-shadow-[0_0_6px_#74bf45] transition-all duration-300"
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
