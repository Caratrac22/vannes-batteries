// ============================================================
// VANNES BATTERIES — Why Us Section
// ============================================================

"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { staggerContainerFast, fadeInUp } from "@/lib/animations";
import SectionTitle from "@/components/ui/SectionTitle";
import { useI18n } from "@/lib/i18n/context";

const advantageKeys = ["stock", "install", "price", "advice"] as const;

export default function WhyUs() {
  const { t } = useI18n();

  return (
    <section className="bg-light-50 py-20 md:py-28 section-separator" aria-label="Pourquoi nous choisir">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title={t.whyUs.title} light />

        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto"
        >
          {advantageKeys.map((key) => {
            const adv = t.whyUs.items[key];
            return (
              <motion.div key={key} variants={fadeInUp} className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-orange shrink-0 mt-1" />
                <div>
                  <h3 className="font-rajdhani font-bold text-dark-950 text-xl uppercase tracking-wide mb-2">
                    {adv.title}
                  </h3>
                  <p className="text-dark-700 text-base leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
