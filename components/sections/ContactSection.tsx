"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { staggerContainerFast, fadeInUp } from "@/lib/animations";
import ShopStatus from "@/components/ui/ShopStatus";
import { useI18n } from "@/lib/i18n/context";

export default function ContactSection() {
  const { t } = useI18n();

  const contactInfo = [
    {
      icon: Phone,
      title: "02 97 49 20 19",
      actionText: t.contactSection.call,
      href: "tel:+33297492019",
    },
    {
      icon: Mail,
      title: "batterie56@hotmail.com",
      actionText: t.contactSection.write,
      href: "mailto:batterie56@hotmail.com?subject=Demande%20de%20renseignement",
    },
    {
      icon: MapPin,
      title: "19 rue Denis Papin\nZ.A. de Kerniol, 56000 Vannes",
      actionText: t.contactSection.getDirections,
      href: "https://maps.app.goo.gl/9UDu2AUPtbS4d1au7",
      target: "_blank",
    },
  ];

  return (
    <section className="bg-light-100 py-16 border-t border-gray-200" aria-label="Contact rapide">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          {contactInfo.map((info) => (
            <motion.div key={info.title} variants={fadeInUp} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center mb-4">
                <info.icon className="w-6 h-6 text-orange" />
              </div>
              <h4 className="font-inter font-medium text-dark-950 whitespace-pre-line mb-3">
                {info.title}
              </h4>
              <a
                href={info.href}
                target={info.target}
                rel={info.target === "_blank" ? "noopener noreferrer" : undefined}
                className="text-orange font-rajdhani font-bold uppercase tracking-wide text-sm hover:text-orange-600 transition-colors underline underline-offset-4 decoration-orange/30 hover:decoration-orange"
              >
                {info.actionText}
              </a>
              {info.icon === MapPin && (
                <div className="mt-3">
                  <ShopStatus compact />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
