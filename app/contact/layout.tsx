import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "CONTACT | VANNES BATTERIES",
  description:
    "Contactez Vannes Batteries — 02 97 49 20 19 — 19 rue Denis Papin, Z.A. de Kerniol, 56000 Vannes. Devis gratuit, conseil batterie.",
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
