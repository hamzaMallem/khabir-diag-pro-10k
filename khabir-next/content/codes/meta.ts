/**
 * Fault-code library (/[locale]/codes). A deliberately small, hand-written set: the codes the workshop sees most,
 * each explained from practice. Do NOT bulk-generate pages from a code database: search engines and AdSense treat
 * thousands of near-identical pages as low-value content.
 *
 * To add a code: add one entry to `codes` below, then the same key to fr.ts, ar.ts and en.ts (TypeScript fails the
 * build if a language is missing). `official` is the SAE J2012 wording, checked against the MIT-licensed
 * dtc-database by Wal33D (https://github.com/Wal33D/dtc-database).
 */

export const systems = ["air", "turbo", "fuel", "ignition", "emissions", "adblue", "cooling", "electrical", "network"] as const;
export type System = (typeof systems)[number];

/** stop = do not keep driving; soon = drive gently and diagnose within days; ok = safe to drive, plan a check. */
export type Severity = "stop" | "soon" | "ok";

export type Brand = "Volkswagen" | "Audi" | "Mercedes-Benz" | "BMW" | "Renault" | "Dacia" | "Peugeot";

export interface CodeMeta {
  code: string;
  system: System;
  severity: Severity;
  /** Standard definition (English, SAE J2012). */
  official: string;
  /** Brands where the workshop meets this code most. Empty = no brand stands out. */
  brands: readonly Brand[];
}

/** The written explanation of one code in one language. */
export interface CodeText {
  /** Short plain-language meaning, used as the page title after the code. */
  title: string;
  what: string;
  symptoms: string[];
  causes: string[];
  /** Can I keep driving? One or two sentences matching `severity`. */
  drive: string;
  /** What the workshop measures before replacing anything. */
  check: string;
}

const VAG = ["Volkswagen", "Audi"] as const;
const DIESELS = ["Volkswagen", "Mercedes-Benz", "Renault", "Dacia", "Peugeot"] as const;

export const codes = [
  // Air intake
  { code: "P0101", system: "air", severity: "soon", official: "Mass or Volume Air Flow Sensor A Circuit Range/Performance", brands: ["Volkswagen", "Mercedes-Benz", "Renault", "Dacia"] },
  { code: "P0106", system: "air", severity: "soon", official: "Manifold Absolute Pressure/Barometric Pressure Sensor Circuit Range/Performance", brands: [] },
  { code: "P0113", system: "air", severity: "ok", official: "Intake Air Temperature Sensor 1 Circuit High", brands: [] },
  { code: "P0171", system: "air", severity: "soon", official: "System Too Lean (Bank 1)", brands: ["Volkswagen", "Audi", "BMW"] },
  { code: "P0172", system: "air", severity: "soon", official: "System Too Rich (Bank 1)", brands: [] },
  { code: "P0638", system: "air", severity: "soon", official: "Throttle Actuator Control Range/Performance (Bank 1)", brands: [] },
  { code: "P2015", system: "air", severity: "soon", official: "Intake Manifold Runner Position Sensor/Switch Circuit Range/Performance (Bank 1)", brands: VAG },
  // Turbo
  { code: "P0234", system: "turbo", severity: "stop", official: "Turbocharger/Supercharger A Overboost Condition", brands: ["Volkswagen", "Audi", "Peugeot"] },
  { code: "P0299", system: "turbo", severity: "soon", official: "Turbocharger/Supercharger A Underboost Condition", brands: ["Volkswagen", "Audi", "Renault", "Dacia"] },
  // Fuel
  { code: "P0087", system: "fuel", severity: "stop", official: "Fuel Rail/System Pressure - Too Low", brands: ["Renault", "Dacia", "Peugeot", "Mercedes-Benz"] },
  { code: "P0191", system: "fuel", severity: "soon", official: "Fuel Rail Pressure Sensor Circuit Range/Performance", brands: [] },
  { code: "P0201", system: "fuel", severity: "soon", official: "Cylinder 1 Injector Circuit", brands: [] },
  // Ignition, glow plugs and timing
  { code: "P0300", system: "ignition", severity: "stop", official: "Random/Multiple Cylinder Misfire Detected", brands: ["Volkswagen", "Renault", "Dacia", "Peugeot"] },
  { code: "P0301", system: "ignition", severity: "stop", official: "Cylinder 1 Misfire Detected", brands: [] },
  { code: "P0335", system: "ignition", severity: "stop", official: "Crankshaft Position Sensor A Circuit", brands: ["Renault", "Dacia", "Peugeot"] },
  { code: "P0340", system: "ignition", severity: "soon", official: "Camshaft Position Sensor A Circuit (Bank 1 or Single Sensor)", brands: [] },
  { code: "P0016", system: "ignition", severity: "stop", official: "Crankshaft Position - Camshaft Position Correlation (Bank 1 Sensor A)", brands: ["Volkswagen", "Audi", "Mercedes-Benz"] },
  { code: "P0380", system: "ignition", severity: "ok", official: "Glow Plug/Heater Circuit A", brands: DIESELS },
  { code: "P0670", system: "ignition", severity: "ok", official: "Glow Plug Control Module 1 Control Circuit/Open", brands: ["Mercedes-Benz", "Volkswagen"] },
  // EGR, catalyst and particulate filter
  { code: "P0401", system: "emissions", severity: "soon", official: "Exhaust Gas Recirculation A Flow Insufficient Detected", brands: ["Volkswagen", "Renault", "Dacia", "Peugeot"] },
  { code: "P0403", system: "emissions", severity: "soon", official: "Exhaust Gas Recirculation A Control Circuit/Open", brands: [] },
  { code: "P0420", system: "emissions", severity: "ok", official: "Catalyst System Efficiency Below Threshold (Bank 1)", brands: [] },
  { code: "P2002", system: "emissions", severity: "soon", official: "Particulate Filter Efficiency Below Threshold (Bank 1)", brands: DIESELS },
  { code: "P2463", system: "emissions", severity: "soon", official: "Particulate Filter Restriction - Soot Accumulation (Bank 1)", brands: DIESELS },
  { code: "P242F", system: "emissions", severity: "soon", official: "Particulate Filter Restriction - Ash Accumulation (Bank 1)", brands: [] },
  { code: "P2453", system: "emissions", severity: "soon", official: "Particulate Filter Pressure Sensor A Circuit Range/Performance", brands: [] },
  // AdBlue / SCR
  { code: "P20EE", system: "adblue", severity: "soon", official: "SCR NOx Catalyst Efficiency Below Threshold (Bank 1)", brands: ["Mercedes-Benz", "Volkswagen", "Peugeot"] },
  { code: "P20E8", system: "adblue", severity: "soon", official: "Reductant Pressure Too Low", brands: ["Peugeot", "Mercedes-Benz"] },
  { code: "P203F", system: "adblue", severity: "soon", official: "Reductant Level Too Low", brands: [] },
  { code: "P229F", system: "adblue", severity: "soon", official: "NOx Sensor Circuit Range/Performance (Bank 1 Sensor 2)", brands: ["Mercedes-Benz", "Volkswagen"] },
  // Cooling
  { code: "P0118", system: "cooling", severity: "soon", official: "Engine Coolant Temperature Sensor 1 Circuit High", brands: [] },
  { code: "P0128", system: "cooling", severity: "ok", official: "Coolant Thermostat (Coolant Temperature Below Thermostat Regulating Temperature)", brands: [] },
  // Electrics and gearbox
  { code: "P0500", system: "electrical", severity: "soon", official: "Vehicle Speed Sensor A Circuit", brands: [] },
  { code: "P0562", system: "electrical", severity: "soon", official: "System Voltage Low", brands: [] },
  { code: "P0571", system: "electrical", severity: "ok", official: "Brake Switch A Circuit", brands: [] },
  { code: "P0700", system: "electrical", severity: "soon", official: "Transmission Control System (MIL Request)", brands: ["Volkswagen", "Mercedes-Benz"] },
  // CAN network
  { code: "U0001", system: "network", severity: "soon", official: "High Speed CAN Communication Bus", brands: [] },
  { code: "U0100", system: "network", severity: "stop", official: "Lost Communication With ECM/PCM A", brands: [] },
  { code: "U0101", system: "network", severity: "soon", official: "Lost Communication With TCM", brands: [] },
  { code: "U0121", system: "network", severity: "soon", official: "Lost Communication With Anti-Lock Brake System (ABS) Control Module A", brands: [] },
] as const satisfies readonly CodeMeta[];

export type CodeId = (typeof codes)[number]["code"];

/** First publication date of the library (YYYY-MM-DD), used in structured data and the sitemap. */
export const CODES_PUBLISHED = "2026-11-17";
