import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "CONTACT | VANNES BATTERIES",
  description:
    "L'entreprise Vannes Batteries propose le conseil, la vente et l'installation de batteries.",
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
