import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { PatreonAppeal } from "@/components/patreon-appeal";
import { JsonLd } from "@/components/seo/json-ld";
import { about, contact } from "@/lib/content";
import { HERO_PORTRAIT } from "@/lib/home";
import { SITE_URL } from "@/lib/site";
import type { CVRow } from "@/lib/types";

export const metadata: Metadata = {
  title: "About",
  description:
    "Aglaya Nogina — visual artist born in Luhansk, working in xerography, relief printing, painting, photography, and writing. Currently studies at Kunstakademie Düsseldorf.",
};

const sections: Array<{ heading: string; rows: CVRow[] }> = [];

export default function AboutPage() {
  const portrait = HERO_PORTRAIT;

  sections.length = 0;
  sections.push(
    { heading: "Education", rows: about.cv.education },
    { heading: "Publications", rows: about.cv.publications },
    { heading: "Solo Exhibitions", rows: about.cv.soloExhibitions },
    { heading: "Selected Exhibitions", rows: about.cv.selectedExhibitions },
  );

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aglaya Nogina",
    givenName: "Aglaya",
    familyName: "Nogina",
    birthPlace: "Luhansk, Ukraine",
    nationality: "Ukrainian",
    jobTitle: "Visual artist",
    description:
      "Visual artist working with xerography, relief printing, painting, photography, ceramics, and writing.",
    url: SITE_URL,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Düsseldorf",
      addressCountry: "DE",
    },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Kharkiv Art College" },
      { "@type": "CollegeOrUniversity", name: "Kyiv National Academy of Fine Arts and Architecture" },
      { "@type": "CollegeOrUniversity", name: "Kunstakademie Düsseldorf" },
    ],
    sameAs: [contact.instagramUrl, contact.patreonUrl],
  };

  return (
    <>
      <JsonLd data={personJsonLd} />
      <Container className="py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          <div className="md:col-span-7">
            <h1 className="font-[family-name:var(--font-vollkorn)] text-[3.5rem] sm:text-[4.5rem] md:text-[5rem] leading-[1] tracking-tight">
              About
            </h1>
            <p className="font-[family-name:var(--font-vollkorn)] italic text-stone text-xl md:text-2xl leading-[1.45] mt-8 max-w-2xl">
              {about.intro}
            </p>
            {about.paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-ink text-base md:text-[1.0625rem] leading-[1.65] mt-6 max-w-2xl"
              >
                {para}
              </p>
            ))}
          </div>

          <figure className="md:col-span-5 md:pt-2">
            <div className="relative aspect-[3/4] border border-mist bg-mist/40">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="label-caps text-stone mt-3">
              In studio · Düsseldorf
            </figcaption>
          </figure>
        </div>
      </Container>

      <Container className="pb-4 md:pb-6">
        <PatreonAppeal />
      </Container>

      <Container className="py-20 md:py-28">
        <div className="space-y-16 md:space-y-20">
          {sections.map((section) =>
            section.rows.length > 0 ? (
              <CVSection
                key={section.heading}
                heading={section.heading}
                rows={section.rows}
              />
            ) : null,
          )}
        </div>
      </Container>
    </>
  );
}

function CVSection({ heading, rows }: { heading: string; rows: CVRow[] }) {
  return (
    <section>
      <h2 className="label-caps text-stone mb-8 md:mb-10">{heading}</h2>
      <ul className="divide-y divide-mist">
        {rows.map((row, i) => (
          <li
            key={i}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 py-4 md:py-5"
          >
            <span
              className="md:col-span-3 font-[family-name:var(--font-vollkorn)] italic text-stone text-base md:text-lg"
              aria-hidden={!row.year}
            >
              {row.year || "·"}
            </span>
            <span className="md:col-span-9 text-ink text-base leading-[1.55]">
              {row.detail}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
