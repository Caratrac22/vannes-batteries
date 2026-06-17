import React from "react";

interface SectionTitleProps {
  badge?: string;
  badgeIcon?: React.ElementType;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}

export default function SectionTitle({
  badge,
  badgeIcon,
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionTitleProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`${alignClass} mb-12 md:mb-16 animate-fade-in-up`}>
      {badge && (
        <span
          className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-4 text-xs font-semibold
                     uppercase tracking-wider text-orange
                     bg-orange/10 border border-orange/30 rounded-full
                     animate-scale-in"
        >
          {badgeIcon && React.createElement(badgeIcon, { className: "w-4 h-4" })}
          {badge}
        </span>
      )}
      <h2
        className={`font-rajdhani font-bold uppercase tracking-tight
                   text-3xl md:text-4xl lg:text-5xl
                   ${light ? "text-dark-950" : "text-white"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base md:text-lg max-w-2xl
                     ${align === "center" ? "mx-auto" : ""}
                     ${light ? "text-dark-700" : "text-muted"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
