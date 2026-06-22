// ============================================================
// VANNES BATTERIES — Battery Categories
// Visual cards with background images
// ============================================================

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeInUp, staggerContainerFast } from "@/lib/animations";
import SectionTitle from "@/components/ui/SectionTitle";
import { useI18n } from "@/lib/i18n/context";
import {
  CarIcon,
  MotorcycleIcon,
  CamperIcon,
  BoatIcon,
  TruckIcon,
  TractorIcon,
  BatteryIcon,
} from "@/components/ui/icons";

const categoryKeys = ["car", "moto", "camper", "boat", "truck", "tractor", "alarm"] as const;

const categoryMeta: Record<string, { icon: typeof CarIcon; count: string; labelKey: string; image: string }> = {
  car:    { icon: CarIcon,        count: "60+",  labelKey: "models", image: "/media/ferrari-california.jpg" },
  moto:   { icon: MotorcycleIcon, count: "180",  labelKey: "refs",   image: "/media/moto.png" },
  camper: { icon: CamperIcon,     count: "40+",  labelKey: "models", image: "/media/camping car mercedes.png" },
  boat:   { icon: BoatIcon,       count: "30+",  labelKey: "models", image: "/media/voilier.jpg" },
  truck:  { icon: TruckIcon,      count: "25+",  labelKey: "models", image: "/media/photo TP.jpg" },
  tractor:{ icon: TractorIcon,    count: "20+",  labelKey: "models", image: "/media/tracteur.jpg" },
  alarm:  { icon: BatteryIcon,    count: "40+",  labelKey: "models", image: "/media/AGM 120.png" },
};

export default function BatteryCategories() {
  const { t } = useI18n();

  return (
    <section
      id="categories"
      className="relative bg-slate-50 py-20 md:py-28 overflow-hidden"
      aria-label="Catégories de batteries"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t.categories.badge}
          badgeIcon={BatteryIcon}
          title={t.categories.title}
          subtitle={t.categories.subtitle}
        />

        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {categoryKeys.map((key) => {
            const cat = t.categories.items[key];
            const meta = categoryMeta[key];
            const Icon = meta.icon;
            const label = meta.labelKey === "models" ? t.categories.models : t.categories.refs;

            return (
              <motion.div
                key={key}
                variants={fadeInUp}
                whileHover={{ scale: 1.03, y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative rounded-2xl overflow-hidden h-72 sm:h-80 cursor-default"
              >
                <Image
                  src={meta.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent
                                group-hover:from-slate-900/95 group-hover:via-slate-900/50 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <motion.div className="w-10 h-10 text-orange mb-3" whileHover={{ rotate: 8, scale: 1.15 }}>
                    <Icon className="w-full h-full" />
                  </motion.div>
                  <h3 className="font-rajdhani font-bold text-white text-xl md:text-2xl uppercase tracking-wide mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
                    {cat.desc}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bebas text-3xl md:text-4xl text-orange">{meta.count}</span>
                    <span className="text-white/50 text-sm uppercase tracking-wider">{label}</span>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-orange/30
                                transition-colors duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-slate-400 text-sm mb-4">{t.categories.not_found}</p>
          <a
            href="tel:+33297492019"
            className="inline-flex items-center gap-2 px-6 py-3
                       text-sm font-semibold uppercase tracking-wider
                       text-slate-700 bg-slate-200 border border-slate-300
                       rounded-full hover:bg-slate-300 transition-colors"
          >
            {t.categories.call_us}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
