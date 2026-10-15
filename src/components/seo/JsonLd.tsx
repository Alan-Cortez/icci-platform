import { SITE, CAMPUSES, WEEKLY_SERVICES } from "@/lib/constants";

export function ChurchJsonLd() {
  const baseUrl = process.env.AUTH_URL || "https://iccinternacional.vercel.app";

  const churchSchema = {
    "@context": "https://schema.org",
    "@type": "Church",
    "@id": `${baseUrl}/#church`,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    image: `${baseUrl}/og-image.jpg`,
    description: "Una familia de fe, esperanza y amor. Red de campus en el norte de México.",
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: "Allende",
      addressRegion: "Coahuila",
      addressCountry: "MX",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.3431,
      longitude: -100.8525,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "10:00",
        description: "Servicio de oración matutina",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Wednesday",
        opens: "19:00",
        closes: "20:30",
        description: "Servicio femenil",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Thursday",
        opens: "19:00",
        closes: "20:30",
        description: "Servicio general",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "19:00",
        closes: "21:00",
        description: "Jóvenes y Varones",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "12:00",
        description: "Servicio general dominical",
      },
    ],
    sameAs: [
      SITE.facebook,
      SITE.youtube,
      SITE.spotify,
      SITE.tiktok,
    ],
    subOrganization: CAMPUSES.map((c) => ({
      "@type": "PlaceOfWorship",
      name: `ICCI Campus ${c.name}`,
      description: c.description,
      address: {
        "@type": "PostalAddress",
        streetAddress: c.address,
        addressLocality: c.name,
        addressRegion: c.state,
        addressCountry: "MX",
      },
      telephone: c.phone,
      url: `${baseUrl}/campus/${c.id}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(churchSchema) }}
    />
  );
}
