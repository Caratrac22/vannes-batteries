// ============================================================
// VANNES BATTERIES — Footer
// 3 columns: brand, navigation, contact + legal links
// ============================================================

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import SocialLinks from "@/components/ui/SocialLinks";

const footerNav = [
  { name: "Accueil", href: "/" },
  { name: "Nos batteries", href: "/#batteries" },
  { name: "Services", href: "/services" },
  { name: "À propos", href: "/a-propos" },
  { name: "Avis clients", href: "/#avis" },
  { name: "Contact", href: "/contact" },
];

const legalLinks = [
  { name: "Mentions légales", href: "/mentions-legales" },
  { name: "Cookies", href: "/politique-en-matiere-de-cookies" },
  { name: "Confidentialité", href: "/politique-de-confidentialite" },
  { name: "CGU", href: "/conditions-d-utilisation" },
];

export default function Footer() {
  return (
    <footer className="bg-dark-700 border-t border-orange/15" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* ── Col 1: Brand ──────────────────────────────── */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="Accueil">
              <span className="w-10 h-10 shrink-0 relative">
                <Image
                  src="/media/LOGO 56 et miniature.jpg"
                  alt="Logo Vannes Batteries"
                  fill
                  sizes="40px"
                  className="object-contain rounded"
                />
              </span>
              <span className="font-rajdhani text-xl tracking-tight">
                <span className="font-normal text-blue-400">VANNES</span>{" "}
                <span className="font-bold text-orange">BATTERIES</span>
              </span>
            </Link>
            <p className="font-rajdhani font-semibold text-orange text-sm uppercase tracking-wider mb-3">
              MA BATTERIE AU MEILLEUR PRIX
            </p>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Votre spécialiste batterie à Vannes depuis plus de 30 ans.
            </p>
            <SocialLinks />
          </div>

          {/* ── Col 2: Navigation ─────────────────────────── */}
          <div>
            <h3 className="font-rajdhani font-bold text-lg uppercase tracking-wide mb-6">
              Navigation
            </h3>
            <ul className="space-y-3">
              {footerNav.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted hover:text-orange transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Contact ────────────────────────────── */}
          <div>
            <h3 className="font-rajdhani font-bold text-lg uppercase tracking-wide mb-6">
              Contact
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange mt-0.5 shrink-0" />
                <span className="text-muted">
                  19 rue Denis Papin, Z.A. de Kerniol
                  <br />
                  56000 Vannes
                </span>
              </li>
              <li>
                <a
                  href="tel:+33297492019"
                  className="flex items-center gap-3 text-muted hover:text-orange transition-colors"
                  aria-label="Appeler le 02 97 49 20 19"
                >
                  <Phone className="w-4 h-4 text-orange shrink-0" />
                  02 97 49 20 19
                </a>
              </li>
              <li>
                <a
                  href="mailto:batterie56@hotmail.com?subject=Demande%20de%20renseignement"
                  className="flex items-center gap-3 text-muted hover:text-orange transition-colors"
                  aria-label="Envoyer un email"
                >
                  <Mail className="w-4 h-4 text-orange shrink-0" />
                  batterie56@hotmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-orange mt-0.5 shrink-0" />
                <span className="text-muted">
                  Lun–Ven 8h30–18h30
                  <br />
                  Sam 9h–12h
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Legal Bar ───────────────────────────────────── */}
        <div className="mt-12 pt-8 border-t border-orange/15">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} VANNES BATTERIES SAS · SIRET 804
              235 695 00017 · RCS Vannes · Président : Arnold Lecarpentier
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-orange transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
