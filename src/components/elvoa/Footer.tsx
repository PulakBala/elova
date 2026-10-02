"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ElvoaLogo } from "./ElvoaLogo";
import {
  fetchFooterDataApi,
  type ApiFooterSettings,
  type ApiFooterSection,
  type ApiFooterSocialLink,
} from "@/lib/api";

// Fallback Default Values (matches initial database seed)
const DEFAULT_SETTINGS: ApiFooterSettings = {
  brand_bio: "Your trusted online store for everyday essentials, trending products and more.",
  copyright_text: "© 2024 ELVOA. All rights reserved.",
  bottom_slogan: "Shop Better. Live Smarter.",
  newsletter_title: "Subscribe to our newsletter",
  newsletter_subtitle: "Get the latest deals and updates.",
  newsletter_enabled: true,
  social_links: [
    { platform: "facebook", title: "Facebook", url: "https://facebook.com", is_active: true },
    { platform: "instagram", title: "Instagram", url: "https://instagram.com", is_active: true },
    { platform: "youtube", title: "YouTube", url: "https://youtube.com", is_active: true },
    { platform: "tiktok", title: "TikTok", url: "https://tiktok.com", is_active: true },
  ],
};

const DEFAULT_SECTIONS: ApiFooterSection[] = [
  {
    id: 1,
    title: "Shop",
    links: [
      { id: 1, title: "All Products", url: "/shop" },
      { id: 2, title: "New Arrivals", url: "/new-arrivals" },
      { id: 3, title: "Best Sellers", url: "/best-sellers" },
      { id: 4, title: "Deals", url: "/deals" },
      { id: 5, title: "Under ৳499", url: "/under-499" },
    ],
  },
  {
    id: 2,
    title: "Customer Care",
    links: [
      { id: 6, title: "Track Order", url: "/track-order" },
      { id: 7, title: "Return Policy", url: "/return-policy" },
      { id: 8, title: "Shipping Info", url: "/shipping-info" },
      { id: 9, title: "FAQ", url: "/faq" },
      { id: 10, title: "Contact Us", url: "/contact" },
    ],
  },
  {
    id: 3,
    title: "About ELVOA",
    links: [
      { id: 11, title: "Our Story", url: "/about" },
      { id: 12, title: "Terms & Conditions", url: "/terms" },
      { id: 13, title: "Privacy Policy", url: "/privacy" },
    ],
  },
];

function renderSocialIcon(platform: string) {
  const p = (platform || "").toLowerCase().trim();
  switch (p) {
    case "facebook":
      return (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    case "twitter":
    case "x":
      return (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 0C5.396 0 0 5.396 0 12.031c0 2.115.549 4.182 1.595 6.002L0 24l6.157-1.615c1.761.96 3.75 1.468 5.874 1.468 6.634 0 12.03-5.396 12.03-12.03C24.061 5.396 18.665 0 12.031 0zm0 22.016c-1.815 0-3.593-.488-5.143-1.411l-.369-.219-3.821 1.002 1.02-3.725-.24-.383A9.972 9.972 0 0 1 2.04 12.03c0-5.509 4.482-9.991 9.991-9.991 5.509 0 9.991 4.482 9.991 9.991 0 5.509-4.482 9.986-9.991 9.986zm5.474-7.48c-.3-.15-1.774-.875-2.049-.975-.275-.1-.475-.15-.675.15s-.774.975-.95 1.175c-.175.2-.35.225-.65.075s-1.267-.467-2.413-1.488c-.892-.796-1.494-1.78-1.669-2.08-.175-.3-.019-.462.131-.612.136-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525s-.675-1.625-.925-2.225c-.244-.584-.492-.505-.675-.514l-.575-.01c-.2 0-.525.075-.8.375s-1.05 1.025-1.05 2.5 1.075 2.9 1.225 3.1c.15.2 2.116 3.23 5.127 4.53 3.011 1.3 3.011.867 3.561.817.55-.05 1.774-.725 2.024-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    case "pinterest":
      return (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.225-.175.271-.403.165-1.5-.698-2.438-2.889-2.438-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      );
    default:
      return (
        <svg className="h-3.5 w-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
  }
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [settings, setSettings] = useState<ApiFooterSettings>(DEFAULT_SETTINGS);
  const [sections, setSections] = useState<ApiFooterSection[]>(DEFAULT_SECTIONS);

  useEffect(() => {
    let isMounted = true;
    fetchFooterDataApi()
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.settings) {
          setSettings((prev) => ({
            ...prev,
            ...data.settings,
            social_links:
              data.settings.social_links && data.settings.social_links.length > 0
                ? data.settings.social_links
                : prev.social_links,
          }));
        }
        if (data.sections && data.sections.length > 0) {
          setSections(data.sections);
        }
      })
      .catch((err) => {
        console.warn("Failed to load dynamic footer data:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const socialLinks: ApiFooterSocialLink[] =
    settings.social_links && settings.social_links.length > 0
      ? settings.social_links
      : DEFAULT_SETTINGS.social_links || [];

  return (
    <footer className="w-full bg-[#111827] text-neutral-300 pt-10 sm:pt-12 pb-6 border-t border-neutral-800">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-12 lg:gap-8 pb-10 border-b border-neutral-800">
          {/* Column 1: Brand & Bio & Socials */}
          <div className="md:col-span-4 lg:col-span-3">
            <ElvoaLogo theme="light" />

            <p className="mt-3.5 text-[12px] sm:text-[12.5px] text-neutral-400 leading-relaxed max-w-xs">
              {settings.brand_bio || DEFAULT_SETTINGS.brand_bio}
            </p>

            {/* Social Icons */}
            {socialLinks.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {socialLinks.map((social, idx) => {
                  if (social.is_active === false || !social.url) return null;
                  return (
                    <a
                      key={`${social.platform}-${idx}`}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.title || social.platform}
                      title={social.title || social.platform}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition-colors hover:border-white hover:text-white"
                    >
                      {renderSocialIcon(social.platform)}
                    </a>
                  );
                })}
              </div>
            )}

            {/* Contact Details (if configured) */}
            {(settings.contact_email || settings.contact_phone || settings.contact_address) && (
              <div className="mt-4 pt-3 border-t border-neutral-800/80 text-[11.5px] text-neutral-400 space-y-1">
                {settings.contact_phone && (
                  <p className="flex items-center gap-1.5">
                    <span className="text-neutral-500">Phone:</span>
                    <a href={`tel:${settings.contact_phone}`} className="hover:text-white transition-colors">
                      {settings.contact_phone}
                    </a>
                  </p>
                )}
                {settings.contact_email && (
                  <p className="flex items-center gap-1.5">
                    <span className="text-neutral-500">Email:</span>
                    <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors">
                      {settings.contact_email}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Dynamic Sections (Columns 2, 3, 4, etc.) */}
          {sections.map((section) => (
            <div key={section.id || section.title} className="sm:col-span-1 md:col-span-2 lg:col-span-2">
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-white">
                {section.title}
              </h4>
              <ul className="mt-3 space-y-2 text-[12px] text-neutral-400">
                {section.links &&
                  section.links.map((link) => {
                    const isExternal =
                      link.open_in_new_tab ||
                      link.url.startsWith("http://") ||
                      link.url.startsWith("https://");

                    if (isExternal) {
                      return (
                        <li key={link.id || link.url}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                          >
                            {link.title}
                          </a>
                        </li>
                      );
                    }

                    return (
                      <li key={link.id || link.url}>
                        <Link href={link.url} className="hover:text-white transition-colors">
                          {link.title}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}

          {/* Newsletter Subscription Column */}
          {settings.newsletter_enabled !== false && (
            <div className="sm:col-span-2 md:col-span-12 lg:col-span-3">
              <h4 className="text-[13px] font-bold text-white">
                {settings.newsletter_title || "Subscribe to our newsletter"}
              </h4>
              <p className="mt-1 text-[12px] text-neutral-400">
                {settings.newsletter_subtitle || "Get the latest deals and updates."}
              </p>

              <form onSubmit={handleSubscribe} className="mt-3 flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full h-9 rounded-l-md bg-white px-3 text-[12px] text-neutral-900 placeholder-neutral-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-9 px-4 rounded-r-md bg-[#FF5B37] text-[12px] font-bold text-white transition-colors hover:bg-[#eb4e2a] shrink-0"
                >
                  Subscribe
                </button>
              </form>

              {subscribed && (
                <p className="mt-1.5 text-[11px] text-emerald-400">
                  Thank you for subscribing!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <span>{settings.copyright_text || "© 2024 ELVOA. All rights reserved."}</span>
          <span>{settings.bottom_slogan || "Shop Better. Live Smarter."}</span>
        </div>
      </div>
    </footer>
  );
}
