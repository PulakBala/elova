"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ElvoaLogo } from "./ElvoaLogo";
import {
  fetchFooterDataApi,
  ApiFooterSettings,
  ApiFooterSection,
} from "@/lib/api";

const defaultSettings: ApiFooterSettings = {
  brand_bio: "Your trusted online store for everyday essentials, trending products and more.",
  copyright_text: "© 2026 ELVOA. All rights reserved.",
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
  contact_phone: "+880 9610-000000",
  contact_email: "support@elvoa.com",
};

const defaultSections: ApiFooterSection[] = [
  {
    id: 1,
    title: "Shop",
    sort_order: 1,
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
    sort_order: 2,
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
    sort_order: 3,
    links: [
      { id: 11, title: "Our Story", url: "/about" },
      { id: 12, title: "Terms & Conditions", url: "/terms" },
      { id: 13, title: "Privacy Policy", url: "/privacy" },
    ],
  },
];

function renderSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p === "facebook") {
    return (
      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (p === "instagram") {
    return (
      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  if (p === "youtube") {
    return (
      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (p === "tiktok") {
    return (
      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    );
  }
  if (p === "twitter" || p === "x") {
    return (
      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (p === "whatsapp") {
    return (
      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M12.031 2C6.511 2 2.025 6.486 2.025 12.006c0 1.956.568 3.784 1.554 5.336L2 22.088l4.898-1.543c1.492.89 3.23 1.461 5.133 1.461 5.52 0 10.006-4.486 10.006-10.006S17.551 2 12.031 2zm5.836 14.159c-.244.685-1.42 1.309-1.961 1.391-.502.076-1.157.108-3.712-.951-3.266-1.353-5.364-4.664-5.527-4.882-.163-.218-1.325-1.764-1.325-3.364 0-1.6 1.037-2.387 1.405-2.76.368-.373.804-.467 1.072-.467.268 0 .536.002.77.014.247.012.578-.094.904.689.327.783 1.116 2.715 1.214 2.912.098.197.163.428.033.689-.13.261-.195.424-.388.653-.193.229-.407.511-.581.687-.193.195-.395.408-.17.794.225.386 1.002 1.651 2.148 2.671 1.474 1.312 2.717 1.719 3.104 1.912.387.193.614.161.841-.1.227-.261.972-1.13 1.231-1.517.259-.387.518-.323.871-.193.353.13 2.235 1.054 2.622 1.247.387.193.645.29.741.452.096.162.096.938-.148 1.623z" />
      </svg>
    );
  }
  if (p === "linkedin") {
    return (
      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    );
  }
  return (
    <svg className="h-3.5 w-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [settings, setSettings] = useState<ApiFooterSettings>(defaultSettings);
  const [sections, setSections] = useState<ApiFooterSection[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchFooterDataApi()
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
        if (Array.isArray(data.sections) && data.sections.length > 0) {
          setSections(data.sections);
        }
      })
      .catch((err) => {
        console.warn("Footer data fetch failed:", err);
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

  const activeSocials =
    settings.social_links && settings.social_links.length > 0
      ? settings.social_links.filter((s) => s.is_active && s.url)
      : defaultSettings.social_links || [];

  const activeSections = sections.length > 0 ? sections : defaultSections;

  const whatsappSocial = activeSocials.find((s) => s.platform.toLowerCase() === "whatsapp");
  const whatsappUrl =
    whatsappSocial?.url ||
    (settings.contact_phone
      ? `https://wa.me/${settings.contact_phone.replace(/[^0-9]/g, "")}`
      : "https://wa.me/8801700000000");

  return (
    <footer className="w-full bg-[#111827] text-neutral-300 pt-10 sm:pt-12 pb-6 border-t border-neutral-800">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        {/* Main Footer Grid: 2 columns on mobile, 12 columns on md/lg */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-8 md:grid-cols-12 lg:gap-8 pb-10 border-b border-neutral-800">
          {/* Column 1: Brand & Bio & Socials (Full width on mobile) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-3">
            <ElvoaLogo theme="light" />

            <p className="mt-3.5 text-[12px] sm:text-[12.5px] text-neutral-400 leading-relaxed max-w-xs">
              {settings.brand_bio || defaultSettings.brand_bio}
            </p>

            {/* Social Icons */}
            {activeSocials.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {activeSocials.map((item) => (
                  <a
                    key={`${item.platform}-${item.url}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.title || item.platform}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition-colors hover:border-white hover:text-white"
                  >
                    {renderSocialIcon(item.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Sections (Columns 2, 3, 4...) */}
          {activeSections.map((sec, idx) => (
            <div
              key={sec.id || sec.title}
              className={`col-span-1 ${
                idx === 0
                  ? "md:col-span-2 lg:col-span-2"
                  : "md:col-span-3 lg:col-span-2"
              }`}
            >
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-white">
                {sec.title}
              </h4>
              <ul className="mt-3 space-y-2 text-[12px] text-neutral-400">
                {sec.links.map((link) => {
                  const isExternal =
                    link.url.startsWith("http://") ||
                    link.url.startsWith("https://") ||
                    Boolean(link.open_in_new_tab);

                  return (
                    <li key={link.id || `${sec.title}-${link.title}`}>
                      {isExternal ? (
                        <a
                          href={link.url}
                          target={link.open_in_new_tab ? "_blank" : undefined}
                          rel={link.open_in_new_tab ? "noopener noreferrer" : undefined}
                          className="hover:text-white transition-colors"
                        >
                          {link.title}
                        </a>
                      ) : (
                        <Link href={link.url} className="hover:text-white transition-colors">
                          {link.title}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Column: Direct Support (Mobile Column 2, Row 2 - Hidden on desktop to preserve 12-col layout) */}
          <div className="col-span-1 md:hidden">
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-white">
              Direct Support
            </h4>
            <ul className="mt-3 space-y-2 text-[12px] text-neutral-400">
              {settings.contact_phone && (
                <li>
                  <a
                    href={`tel:${settings.contact_phone.replace(/[^0-9+]/g, "")}`}
                    className="hover:text-white transition-colors block"
                  >
                    Hotline: {settings.contact_phone}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors block"
                >
                  WhatsApp: {settings.contact_phone || "+880 1700-000000"}
                </a>
              </li>
              <li className="text-[11px] text-neutral-500 pt-0.5">
                Sat – Thu: 9AM – 9PM
              </li>
            </ul>
          </div>

          {/* Column: Newsletter Subscription (Full width on mobile) */}
          {settings.newsletter_enabled !== false && (
            <div className="col-span-2 md:col-span-12 lg:col-span-3">
              <h4 className="text-[13px] font-bold text-white">
                {settings.newsletter_title || defaultSettings.newsletter_title}
              </h4>
              <p className="mt-1 text-[12px] text-neutral-400">
                {settings.newsletter_subtitle || defaultSettings.newsletter_subtitle}
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
          <span>{settings.copyright_text || defaultSettings.copyright_text}</span>
          <span>{settings.bottom_slogan || defaultSettings.bottom_slogan}</span>
        </div>
      </div>
    </footer>
  );
}
