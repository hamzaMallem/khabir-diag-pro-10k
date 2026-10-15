import type { ReactNode } from "react";

export function MercedesLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" className={className} aria-label="Mercedes-Benz">
      {/* Outer circle */}
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.8" />
      {/* 3-pointed faceted star */}
      <polygon points="20,3 20,20 18.2,19" fill="currentColor" />
      <polygon points="20,3 20,20 21.8,19" fill="currentColor" opacity="0.6" />
      <polygon points="5.3,28.5 20,20 20,22" fill="currentColor" />
      <polygon points="5.3,28.5 20,20 18.2,19" fill="currentColor" opacity="0.6" />
      <polygon points="34.7,28.5 20,20 21.8,19" fill="currentColor" />
      <polygon points="34.7,28.5 20,20 20,22" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function BmwLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-label="BMW">
      {/* Outer chrome ring */}
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.8" />
      {/* Inner quadrant border */}
      <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.4" />
      {/* Quadrants */}
      <path d="M20 9 A11 11 0 0 0 9 20 H20 Z" fill="currentColor" opacity="0.85" />
      <path d="M20 31 A11 11 0 0 0 31 20 H20 Z" fill="currentColor" opacity="0.85" />
      <line x1="20" y1="9" x2="20" y2="31" stroke="currentColor" strokeWidth="1.2" />
      <line x1="9" y1="20" x2="31" y2="20" stroke="currentColor" strokeWidth="1.2" />
      {/* Letters B M W on top ring */}
      <text x="13.2" y="7.5" fill="currentColor" fontSize="3.6" fontWeight="bold" fontFamily="system-ui, sans-serif">B</text>
      <text x="18.1" y="6.2" fill="currentColor" fontSize="3.6" fontWeight="bold" fontFamily="system-ui, sans-serif">M</text>
      <text x="23.4" y="7.5" fill="currentColor" fontSize="3.6" fontWeight="bold" fontFamily="system-ui, sans-serif">W</text>
    </svg>
  );
}

export function AudiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 68 28" fill="none" className={className} aria-label="Audi">
      <circle cx="11" cy="14" r="10" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="26" cy="14" r="10" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="41" cy="14" r="10" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="56" cy="14" r="10" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export function VolkswagenLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-label="Volkswagen">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="20" cy="20" r="14.8" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      {/* V on top */}
      <path
        d="M13.8 11.5 L19.2 21.5 H20.8 L26.2 11.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* W below */}
      <path
        d="M11 17.5 L15.5 28.5 L18 23"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29 17.5 L24.5 28.5 L22 23"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 23 L20 27.5 L22 23"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PorscheLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 38" fill="none" className={className} aria-label="Porsche">
      {/* Shield Outline */}
      <path
        d="M5 4 H27 C27 4, 27.8 17.5, 24.8 26.5 C22.2 33.5, 16 36.5, 16 36.5 C16 36.5, 9.8 33.5, 7.2 26.5 C4.2 17.5, 5 4, 5 4 Z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      <path d="M5.5 9 H26.5" stroke="currentColor" strokeWidth="1.2" />
      <text x="16" y="7.5" textAnchor="middle" fill="currentColor" fontSize="3.2" fontWeight="bold" letterSpacing="0.8" fontFamily="system-ui, sans-serif">
        PORSCHE
      </text>
      <path d="M16 9 V35" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.8 20.5 H26.2" stroke="currentColor" strokeWidth="1.2" />
      {/* Center Stuttgart shield */}
      <path
        d="M12.5 16 H19.5 V23.5 C19.5 25.5, 16 27, 16 27 C16 27, 12.5 25.5, 12.5 23.5 Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Stripes in top-right and bottom-left */}
      <line x1="16" y1="12" x2="26" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="16" y1="15" x2="26" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="16" y1="18" x2="26" y2="18" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="6" y1="24" x2="16" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="7" y1="27" x2="16" y2="27" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="8" y1="30" x2="16" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {/* Antlers / lines in top-left and bottom-right */}
      <path d="M8 12 L14 12 M9 15 L14 15 M10 18 L14 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M18 24 L23 24 M18 27 L22 27 M18 30 L21 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function MiniLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 26" fill="currentColor" className={className} aria-label="MINI">
      <circle cx="30" cy="13" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <text
        x="30"
        y="15.8"
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="900"
        letterSpacing="1"
        fontFamily="system-ui, sans-serif"
        fill="currentColor"
      >
        MINI
      </text>
      {/* Left wing feathers */}
      <path d="M19 8 H5 L8 10.5 H19 Z" />
      <path d="M19 11.5 H3 L5.5 14 H19 Z" />
      <path d="M19 15 H5 L7.5 17.5 H19 Z" />
      {/* Right wing feathers */}
      <path d="M41 8 H55 L52 10.5 H41 Z" />
      <path d="M41 11.5 H57 L54.5 14 H41 Z" />
      <path d="M41 15 H55 L52.5 17.5 H41 Z" />
    </svg>
  );
}

export function SkodaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" className={className} aria-label="Škoda">
      {/* Outer circle */}
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.8" />
      {/* Winged Arrow */}
      <path d="M25 15 L32 20 L25 25 L26.2 20 Z" />
      <circle cx="22.5" cy="20" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21.5 16.5 C17 12.5, 10 10.5, 7.5 12.5 C11.5 15.5, 16.5 17.5, 19.5 17.5 Z" />
      <path d="M19.5 18.5 C14.5 16.5, 9.5 17.5, 6.5 20.5 C10.5 21.5, 15.5 21, 18.5 20.5 Z" />
      <path d="M20.5 21.5 C16.5 22.5, 10.5 24.5, 7.5 27.5 C11.5 27.5, 16.5 25.5, 19.5 23 Z" />
    </svg>
  );
}

export function SeatLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 34" fill="currentColor" className={className} aria-label="SEAT">
      {/* Upper diagonal segment of the stylized S */}
      <path d="M11 5 H28 L23 13.5 H6 Z" />
      {/* Lower diagonal segment of the stylized S */}
      <path d="M15 20.5 H32 L27 29 H10 Z" />
      {/* Center connector/diagonal slash */}
      <path d="M21.5 14.5 L16.5 19.5 H21.5 L26.5 14.5 Z" />
    </svg>
  );
}

export interface BrandData {
  id: string;
  name: string;
  logo: ReactNode;
}

export const CAR_BRANDS: BrandData[] = [
  { id: "mercedes", name: "MERCEDES-BENZ", logo: <MercedesLogo /> },
  { id: "bmw", name: "BMW", logo: <BmwLogo /> },
  { id: "audi", name: "AUDI", logo: <AudiLogo /> },
  { id: "volkswagen", name: "VOLKSWAGEN", logo: <VolkswagenLogo /> },
  { id: "porsche", name: "PORSCHE", logo: <PorscheLogo /> },
  { id: "mini", name: "MINI", logo: <MiniLogo /> },
  { id: "skoda", name: "SKODA", logo: <SkodaLogo /> },
  { id: "seat", name: "SEAT", logo: <SeatLogo /> },
];
