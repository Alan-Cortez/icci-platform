import { SITE, CAMPUSES, WEEKLY_SERVICES, getBaseUrl } from "@/lib/constants";

export function ChurchJsonLd() {
  const baseUrl = getBaseUrl();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "ICCI",
    alternateName: [
      "Iglesia Comunidad De Cristo",
      "Iglesias Comunidad De Cristo Internacional",
      "ICCInt",
      "ICC",
      "Comunidad De Cristo",
      "ICCI Allende",
    ],
    description: "Sitio oficial de la Iglesia Comunidad De Cristo Internacional (ICCI / ICCInt).",
    inLanguage: "es-MX",
    publisher: {
      "@id": `${baseUrl}/#church`,
    },
  };

  const churchSchema = {
    "@context": "https://schema.org",
    "@type": "Church",
    "@id": `${baseUrl}/#church`,
    name: SITE.name,
    alternateName: [
      "ICCI",
      "ICCInt",
      "ICC",
      "Iglesia Comunidad De Cristo",
      "Comunidad De Cristo Internacional",
      "Comunidad De Cristo",
      "Iglesia Cristiana en Allende Coahuila",
    ],
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    image: `${baseUrl}/og-image.jpg`,
    description: "Iglesias Comunidad De Cristo Internacional (ICCI / ICCInt) es una red de iglesias cristianas con sede central en Allende, Coahuila, México, y campus en Sabinas, Múzquiz, Barroterán, Anáhuac y Durango. Fundada bajo el lema 'Somos uno, uno somos', ofrece servicios de adoración, palabra y ministerios familiares de manera presencial y transmisiones en línea.",
    slogan: "Somos uno, uno somos",
    telephone: SITE.phone,
    email: SITE.email,
    knowsAbout: [
      "Iglesia Cristiana Evangélica",
      "Comunidad de Fe",
      "Servicios de Adoración",
      "Transmisiones en Vivo",
      "ICCI",
      "Allende Coahuila",
    ],
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify([websiteSchema, churchSchema]) }}
    />
  );
}
