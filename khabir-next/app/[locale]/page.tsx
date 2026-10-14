import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { HeroSection } from "@/components/hero/HeroSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { DiagnosticDemo } from "@/components/sections/DiagnosticDemo";
import { FaqSection } from "@/components/sections/FaqSection";
import { JsonLd } from "@/components/sections/JsonLd";
import { LocationSection } from "@/components/sections/LocationSection";
import { MethodSection } from "@/components/sections/MethodSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { PromisesSection } from "@/components/sections/PromisesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main id="main" tabIndex={-1}>
      {/* The order of these lines is the order of the page. Move a line to move a section. */}
      <HeroSection dict={dict} />
      <ProblemSection dict={dict} />
      <MethodSection dict={dict} />
      <DiagnosticDemo
        labels={{
          kicker: dict.lab_kicker,
          heading: dict.lab_h,
          intro: dict.lab_p,
          note: dict.lab_note,
          panelTitle: dict.hud_title,
          holdButton: dict.lab_btn,
          runAgain: dict.lab_again,
          runScan: dict.lab_rm,
          statusIdle: dict.lab_idle,
          statusRunning: dict.lab_run,
          statusDone: dict.lab_done,
          result: dict.lab_result,
          ok: dict.ok,
          fault: dict.bad,
          rows: {
            engine: dict.r_engine,
            trans: dict.r_trans,
            abs: dict.r_abs,
            airbag: dict.r_airbag,
            clim: dict.r_clim,
            steer: dict.r_steer,
            scr: dict.r_scr,
            dose: dict.r_dose,
            noxup: dict.r_noxup,
            noxdown: dict.r_noxdown,
          },
        }}
      />
      <ServicesSection dict={dict} />
      <PromisesSection dict={dict} />
      <FaqSection dict={dict} />
      <LocationSection dict={dict} />
      <ContactSection dict={dict} />
      <JsonLd dict={dict} locale={locale} />
    </main>
  );
}
