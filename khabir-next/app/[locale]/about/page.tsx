import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/pageMetadata";
import { PageHeader, WhatsAppCta, pageStyles as styles } from "@/components/pages/PageParts";
import { Reveal } from "@/components/ui/Reveal";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, "/about", dict.ab_meta_title, dict.ab_meta_desc);
}

export default async function AboutPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  // Story and team confirmed by the owner (2026-10-14). Photos are real shots from the workshop (public/media/workshop-*.jpg).
  const photos = [
    { src: "/media/workshop-1.jpg", width: 1080, height: 1080, caption: dict.ab_ph1 },
    { src: "/media/workshop-2.jpg", width: 1000, height: 1334, caption: dict.ab_ph2 },
  ];
  const team = [
    { id: "youssef", name: dict.tm_youssef, text: dict.tm_youssef_p },
    { id: "saidi", name: dict.tm_saidi, text: dict.tm_saidi_p },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader kicker={dict.ab_kicker} title={dict.ab_h} intro={dict.ab_p} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className={styles.blocks}>
            <Reveal as="article" className={styles.block} index={0}>
              <h2>{dict.ab_story_t}</h2>
              <p>{dict.ab_story_p}</p>
            </Reveal>
            <Reveal as="article" className={styles.block} index={1}>
              <h2>{dict.ab_team_t}</h2>
              <ul className={styles.team}>
                {team.map((member) => (
                  <li key={member.id}>
                    <strong>{member.name}</strong>
                    <span>{member.text}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal as="article" className={styles.block} index={2}>
              <h2>{dict.ab_method_t}</h2>
              <p>{dict.ab_method_p}</p>
            </Reveal>
            <Reveal as="article" className={styles.block} index={3}>
              <h2>{dict.ab_tools_t}</h2>
              <p>{dict.ab_tools_p}</p>
            </Reveal>
            <Reveal as="article" className={styles.block} index={4}>
              <h2>{dict.ab_photos_t}</h2>
              <div className={styles.photos}>
                {photos.map((photo) => (
                  <figure key={photo.src} className={styles.photo}>
                    <Image src={photo.src} alt={photo.caption} width={photo.width} height={photo.height} sizes="(max-width: 700px) 100vw, 50vw" />
                    <figcaption>{photo.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </Reveal>
          </div>
          <WhatsAppCta locale={locale} title={dict.cta_h} text={dict.cta_sub} label={dict.cta} message={dict.wa_msg} />
        </div>
      </section>
    </main>
  );
}
