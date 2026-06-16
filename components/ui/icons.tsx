import type { SVGProps } from "react";

const s = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.5,
  stroke: "currentColor",
};

export function LightningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...s} {...props}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}

export function BatteryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...s} {...props}>
      <rect x="2" y="7" width="16" height="10" rx="2" />
      <path d="M22 11v2" />
      <path d="M6 11v2" />
      <path d="M10 11v2" />
      <path d="M14 11v2" />
    </svg>
  );
}

export function MotorcycleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...s} {...props}>
      <circle cx="6" cy="15" r="4" />
      <circle cx="18" cy="15" r="4" />
      <path d="M6 11l4-4h4l2 4" />
      <path d="M10 15l6-4" />
      <path d="M2 15h4" />
      <path d="M18 15h4" />
    </svg>
  );
}

export function CarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...s} {...props}>
      <path d="M3 13.5V17a1 1 0 001 1h1a1 1 0 001-1v-1h14v1a1 1 0 001 1h1a1 1 0 001-1v-3.5" />
      <path d="M3 13.5L5.5 7h13l2.5 6.5" />
      <circle cx="7.5" cy="14.5" r="1.5" />
      <circle cx="16.5" cy="14.5" r="1.5" />
    </svg>
  );
}

export function CamperIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...s} {...props}>
      <path d="M2 14v3a1 1 0 001 1h1a1 1 0 001-1v-1h14v1a1 1 0 001 1h1a1 1 0 001-1v-3" />
      <path d="M2 14l2-7h12l2 7" />
      <path d="M12 7v7" />
      <circle cx="7" cy="15" r="1.5" />
      <circle cx="17" cy="15" r="1.5" />
    </svg>
  );
}

export function BoatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...s} {...props}>
      <path d="M2 16l10-5 10 5" />
      <path d="M12 3v8" />
      <path d="M8 11h8" />
      <path d="M4 18l1 2h14l1-2" />
    </svg>
  );
}

export function TruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...s} {...props}>
      <path d="M2 16V6a1 1 0 011-1h11a1 1 0 011 1v10" />
      <path d="M15 12h5l2 3v4h-2" />
      <circle cx="6" cy="17" r="2" />
      <circle cx="16" cy="17" r="2" />
    </svg>
  );
}

export function TractorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...s} {...props}>
      <circle cx="17" cy="16" r="4" />
      <path d="M7 12l4-5h2l2 5" />
      <path d="M7 12H4a2 2 0 00-2 2v2a2 2 0 002 2h1" />
      <circle cx="7" cy="17" r="2.5" />
      <path d="M13 12v4" />
      <path d="M17 12v-3" />
    </svg>
  );
}

export function WarningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...s} {...props}>
      <path d="M12 3L2 21h20L12 3z" />
      <path d="M12 9v4" />
      <path d="M12 17v.01" />
    </svg>
  );
}

export function WrenchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...s} {...props}>
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.5-3.5a5 5 0 01-7.1 7.1l-6.3 6.3a2.1 2.1 0 01-3-3l6.3-6.3a5 5 0 017.1-7.1l-3.5 3.5z" />
    </svg>
  );
}

export function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...s} fill="currentColor" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...s} {...props}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
