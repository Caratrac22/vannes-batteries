import { generatePageMetadata } from "@/lib/metadata";
import ContactSection from "@/components/sections/ContactSection";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata = generatePageMetadata({
  title: "CONTACT | VANNES BATTERIES",
  description:
    "Contactez Vannes Batteries — 02 97 49 20 19 — 19 rue Denis Papin, Z.A. de Kerniol, 56000 Vannes. Devis gratuit, conseil batterie.",
  path: "/contact",
});

const contactDetails = [
  {
    icon: Phone,
    label: "Téléphone",
    value: "02 97 49 20 19",
    href: "tel:+33297492019",
  },
  {
    icon: Mail,
    label: "Email",
    value: "batterie56@hotmail.com",
    href: "mailto:batterie56@hotmail.com?subject=Demande%20de%20renseignement",
  },
  {
    icon: MapPin,
    label: "Adresse",
    value: "19 rue Denis Papin, Z.A. de Kerniol\n56000 Vannes",
    href: "https://maps.app.goo.gl/9UDu2AUPtbS4d1au7",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-dark-950 pt-32 pb-16 relative overflow-hidden">
        <div className="gradient-overlay absolute inset-0 opacity-50" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="font-rajdhani font-bold uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl text-white mb-6">
            NOUS CONTACTER
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-3xl mx-auto">
            Une question ? Besoin d&apos;un devis ? Notre équipe est à votre
            disposition pour vous conseiller et vous accompagner.
          </p>
        </div>
      </section>

      <section className="bg-light-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="font-rajdhani font-bold text-2xl uppercase text-dark-950">
                Coordonnées
              </h2>
              <div className="space-y-6">
                {contactDetails.map((detail) => (
                  <div key={detail.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center shrink-0">
                      <detail.icon className="w-5 h-5 text-orange" />
                    </div>
                    <div>
                      <p className="text-sm text-muted font-medium uppercase tracking-wider mb-1">
                        {detail.label}
                      </p>
                      <a
                        href={detail.href}
                        className="text-slate-800 font-medium hover:text-orange transition-colors whitespace-pre-line"
                      >
                        {detail.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-orange" />
                </div>
                <div>
                  <p className="text-sm text-muted font-medium uppercase tracking-wider mb-1">
                    Horaires
                  </p>
                  <div className="text-slate-800 font-medium space-y-1">
                    <p>Lun–Ven : 8h30–12h00 / 14h00–18h30</p>
                    <p>Sam : 9h00–12h00</p>
                    <p>Dim : Fermé</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 h-[400px] md:h-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2682.123456789!2d-2.771305!3d47.679327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s19%20Rue%20Denis%20Papin%2C%2056000%20Vannes!5e0!3m2!1sfr!2sfr!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Carte Vannes Batteries"
              />
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
