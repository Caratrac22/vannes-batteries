import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "À PROPOS | VANNES BATTERIES",
  description:
    "L'entreprise Vannes Batteries propose le conseil, la vente et l'installation de batteries.",
  path: "/a-propos",
});

export default function AProposLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
