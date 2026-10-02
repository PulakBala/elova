"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { TopBar } from "@/components/elvoa/TopBar";
import { Header } from "@/components/elvoa/Header";
import { SubNav } from "@/components/elvoa/SubNav";
import { CategorySidebar } from "@/components/elvoa/CategorySidebar";
import { TrustPillars } from "@/components/elvoa/TrustPillars";
import { Footer } from "@/components/elvoa/Footer";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface FooterPageShellProps {
  children: ReactNode;
  breadcrumbs: BreadcrumbItem[];
  title?: string;
  subtitle?: string;
  badge?: string;
  maxWidth?: "default" | "content" | "wide";
  headerCentered?: boolean;
}

export function FooterPageShell({
  children,
  breadcrumbs,
  title,
  subtitle,
  badge,
  maxWidth = "default",
  headerCentered = false,
}: FooterPageShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const containerMaxWidth =
    maxWidth === "content"
      ? "max-w-4xl"
      : maxWidth === "wide"
      ? "max-w-5xl"
      : "max-w-[1360px]";

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF9] text-neutral-900 selection:bg-[#FF5B37] selection:text-white overflow-x-hidden">
      {/* 1. Global Navigation */}
      <TopBar />
      <Header onOpenSidebar={() => setSidebarOpen(true)} />
      <SubNav onOpenSidebar={() => setSidebarOpen(true)} />

      <CategorySidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Page Content */}
      <main className="flex-1 py-5 sm:py-8 lg:py-10">
        <div className={`mx-auto ${containerMaxWidth} px-4 sm:px-6`}>
          {/* Breadcrumbs Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center flex-wrap gap-1.5 text-xs text-neutral-500 mb-5 sm:mb-6"
          >
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-neutral-900 transition-colors"
            >
              <Home className="h-3.5 w-3.5 text-neutral-400" />
              <span>Home</span>
            </Link>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div key={crumb.label + idx} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-neutral-400 shrink-0" />
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-neutral-900 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-neutral-900">
                      {crumb.label}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Optional Page Header Banner */}
          {title && (
            <div
              className={`mb-6 sm:mb-8 ${
                headerCentered ? "text-center max-w-2xl mx-auto" : ""
              }`}
            >
              {badge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF5B37]/10 text-[#FF5B37] mb-2.5">
                  <span>{badge}</span>
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm sm:text-base text-neutral-600 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Page Body */}
          {children}
        </div>
      </main>

      {/* 3. Global Trust Pillars */}
      <TrustPillars />

      {/* 4. Global Footer */}
      <Footer />
    </div>
  );
}
