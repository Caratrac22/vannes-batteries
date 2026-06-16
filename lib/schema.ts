// ============================================================
// VANNES BATTERIES — JSON-LD LocalBusiness Schema
// ============================================================

export function getLocalBusinessSchema(rating?: number, reviewCount?: number) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Vannes Batteries",
    description:
      "Spécialiste en batteries à Vannes depuis plus de 30 ans. Vente, conseil et pose en magasin. +300 modèles.",
    url: "https://www.vannes-batteries.fr",
    telephone: "+33297492019",
    email: "batterie56@hotmail.com",
    image: "https://www.vannes-batteries.fr/og-image",
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: "19 rue Denis Papin, Z.A. de Kerniol",
      addressLocality: "Vannes",
      postalCode: "56000",
      addressRegion: "Bretagne",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 47.679327,
      longitude: -2.771305,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:30",
        closes: "12:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "14:00",
        closes: "18:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "12:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/vannes.batteries/?locale=fr_FR",
      "https://www.instagram.com/vannesbatteries/?hl=fr",
      "https://x.com/VANNESBATTERIES",
      "https://www.pagesjaunes.fr/pros/55563862",
    ],
    founder: {
      "@type": "Person",
      name: "Arnold Lecarpentier",
    },
    foundingDate: "2014-01-01",
    legalName: "VANNES BATTERIES SAS",
    taxID: "804 235 695 00017",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(rating ?? 4.8),
      reviewCount: String(reviewCount ?? 259),
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export const localBusinessSchema = getLocalBusinessSchema();