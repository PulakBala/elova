import Link from "next/link";

interface ElvoaLogoProps {
  theme?: "dark" | "light";
  className?: string;
  showSubtitle?: boolean;
}

export function ElvoaLogo({
  theme = "dark",
  className = "",
  showSubtitle = true,
}: ElvoaLogoProps) {
  const isLight = theme === "light";
  const textColor = isLight ? "text-white" : "text-neutral-900";
  const subtitleColor = isLight ? "text-neutral-400" : "text-neutral-500";
  const dotColor = "#FF5B37";

  return (
    <Link
      href="/"
      className={`inline-flex flex-col items-start leading-none select-none transition-opacity hover:opacity-95 ${className}`}
      aria-label="ELVOA - Everything You Need, One Place"
    >
      {/* Brand Wordmark */}
      <div className={`flex items-baseline font-black tracking-[-0.03em] ${textColor}`}>
        <span className="text-2xl sm:text-[26px] font-extrabold tracking-tight">
          ELVO
        </span>
        {/* Custom Stylized "A" with coral circular core */}
        <span className="relative inline-flex items-baseline ml-[1px] text-2xl sm:text-[26px] font-extrabold tracking-tight">
          A
          <span
            className="absolute left-1/2 -translate-x-1/2 bottom-[4px] h-[5px] w-[5px] rounded-full"
            style={{ backgroundColor: dotColor }}
          />
        </span>
      </div>

      {/* Brand Tagline */}
      {showSubtitle && (
        <span
          className={`mt-1 text-[9.5px] sm:text-[10.5px] font-medium tracking-tight ${subtitleColor}`}
        >
          Everything You Need, One Place.
        </span>
      )}
    </Link>
  );
}

