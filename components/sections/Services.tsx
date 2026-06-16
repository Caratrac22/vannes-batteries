"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MessageCircleHeart, ShoppingCart, Wrench, SearchCheck, Recycle, Building2, MapPin } from "lucide-react";
import { staggerContainerFast, fadeInLeft, fadeInRight, fadeInUp } from "@/lib/animations";
import SectionTitle from "@/components/ui/SectionTitle";
import { WrenchIcon } from "@/components/ui/icons";
import { useI18n } from "@/lib/i18n/context";

const iconMap: Record<string, typeof MessageCircleHeart> = {
  advice: MessageCircleHeart,
  stock: ShoppingCart,
  install: Wrench,
  check: SearchCheck,
  recycle: Recycle,
  pro: Building2,
};

export default function Services() {
  const { t } = useI18n();
  const items = t.services.items;
  const keys = Object.keys(items);

  return (
    <section id="services" className="bg-dark-900 py-20 md:py-28 relative overflow-hidden" aria-label="Nos services">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          badge={t.services.badge}
          badgeIcon={WrenchIcon}
          title={t.services.title}
          subtitle={t.services.subtitle}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="info-banner max-w-3xl mx-auto mb-16"
        >
          <MapPin className="w-4 h-4 inline-block -mt-0.5 text-orange" /> <strong className="text-orange">{t.services.in_store}</strong>
          <br className="hidden sm:block" />
          {t.services.in_store_address}
        </motion.div>

        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {keys.map((key, index) => {
            const service = items[key as keyof typeof items];
            const Icon = iconMap[key] || Wrench;
            const hasPhoto = key === "install";

            if (hasPhoto) {
              return (
                <motion.div
                  key={key}
                  variants={fadeInUp}
                  className="relative col-span-1 md:col-span-2 lg:col-span-2 row-span-1 rounded-2xl overflow-hidden group min-h-[300px]"
                >
                  <Image
                    src="/media/pose batterie .2.jpg"
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 66vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-dark-950/60 to-transparent" />
                  <div className="relative z-10 h-full p-8 md:p-10 flex flex-col justify-end">
                    <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-xl bg-orange/20 border border-orange/30 backdrop-blur-sm">
                      <Icon className="w-7 h-7 text-orange" />
                    </div>
                    <h3 className="font-rajdhani font-bold text-2xl md:text-3xl uppercase tracking-wide mb-3 text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed max-w-lg">
                      {service.desc}
                    </p>
                  </div>
                </motion.div>
              );
            }

            const isEven = index % 2 === 0;
            const variant = isEven ? fadeInLeft : fadeInRight;

            return (
              <motion.div
                key={key}
                variants={variant}
                className="glass-card p-8 group"
              >
                <div className="relative w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-dark-700 border border-orange/20 overflow-hidden">
                  <div className="absolute inset-0 bg-orange/20 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out rounded-full" />
                  <Icon className="w-7 h-7 text-orange relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>

                <h3 className="font-rajdhani font-bold text-xl uppercase tracking-wide mb-3 text-white">
                  {service.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
