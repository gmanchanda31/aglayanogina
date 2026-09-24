import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { about, contact } from "@/lib/content";
import { ArtistIntro } from "@/components/about/artist-intro";
import { SITE_URL } from "@/lib/site";
import type { CVRow } from "@/lib/types";
import { formatYearRange } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "Aglaya Nogina — visual artist born in Luhansk, working in xerography, relief printing, painting, photography, and writing. Currently studies at Kunstakademie Düsseldorf.",
};

const sections: Array<{ heading: string; rows: CVRow[] }> = [
  { heading: "Education", rows: about.cv.education },
  { heading: "Publications", rows: about.cv.publications },
  { heading: "Solo exhibitions", rows: about.cv.soloExhibitions },
  { heading: "Selected exhibitions", rows: about.cv.selectedExhibitions },
];

export default function AboutPage() {
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
    sameAs: [contact.instagramUrl],
  };

  return (
    <>
      <JsonLd data={personJsonLd} />
      <ArtistIntro heading={<h1 className="type-title mb-tight">About</h1>} />

      <Container className="pt-section">
        <div className="space-y-section">
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
      <h2 className="type-heading text-ink mb-tight">{heading}</h2>
      <ul className="divide-y divide-mist">
        {rows.map((row, i) => (
          <li
            key={i}
            className="grid grid-cols-1 md:grid-cols-12 md:items-baseline md:gap-x-block py-tight"
          >
            <span
              className="md:col-span-3 type-meta text-ink nums"
              aria-hidden={!row.year}
            >
              {row.year ? formatYearRange(row.year) : "·"}
            </span>
            <span className="md:col-span-9 type-body text-ink">
              {formatYearRange(row.detail)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
