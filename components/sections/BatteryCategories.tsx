// ============================================================
// VANNES BATTERIES — Battery Categories
// Visual cards with background images
// ============================================================

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeInUp, staggerContainerFast } from "@/lib/animations";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  CarIcon,
  MotorcycleIcon,
  CamperIcon,
  BoatIcon,
  TruckIcon,
  TractorIcon,
  BatteryIcon,
} from "@/components/ui/icons";

const categories = [
  {
    icon: CarIcon,
    title: "Batterie Voiture",
    description:
      "AGM, Gel, Start & Stop, véhicules de collection. Toutes technologies.",
    count: "60+",
    label: "modèles",
    image: "/media/ferrari california.jpg",
  },
  {
    icon: MotorcycleIcon,
    title: "Batterie Moto",
    description:
      "Du scooter à la moto sportive, toutes cylindrées. Étanches haute performance.",
    count: "180",
    label: "références",
    image: "/media/HR48.jpg",
  },
  {
    icon: CamperIcon,
    title: "Camping-Car",
    description:
      "Sans entretien, étanches, normes européennes. Kits panneaux solaires.",
    count: "40+",
    label: "modèles",
    image: "/media/camping car mercedes.png",
  },
  {
    icon: BoatIcon,
    title: "Bateau Moteur & Voilier",
    description:
      "Décharge lente, étanches, haute durabilité pour voiliers et moteurs.",
    count: "30+",
    label: "modèles",
    image: "/media/voilier.jpg",
  },
  {
    icon: TruckIcon,
    title: "Poids Lourds & TP",
    description:
      "Camions, engins de chantier. Batteries haute capacité longue durée.",
    count: "25+",
    label: "modèles",
    image: "/media/photo TP.jpg",
  },
  {
    icon: TractorIcon,
    title: "Agricole",
    description:
      "Tracteurs, moissonneuses. Conçues pour utilisation intensive.",
    count: "20+",
    label: "modèles",
    image: "/media/facade.1.jpg",
  },
  {
    icon: BatteryIcon,
    title: "Alarme & Industriel",
    description:
      "Onduleurs, alarmes, chariots élévateurs, sites isolés. Fiables.",
    count: "40+",
    label: "modèles",
    image: "/media/AGM 120.png",
  },
];

export default function BatteryCategories() {
  return (
    <section
      id="categories"
      className="relative bg-dark-950 py-20 md:py-28 overflow-hidden"
      aria-label="Catégories de batteries"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Notre spécialité"
          badgeIcon={BatteryIcon}
          title="Trouvez votre batterie"
          subtitle="De la voiture au tracteur, du bateau à l'alarme — nous avons la batterie qu'il vous faut."
        />

        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.title}
              variants={fadeInUp}
              whileHover={{ scale: 1.03, y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative rounded-2xl overflow-hidden
                         h-72 sm:h-80 cursor-default"
            >
              {/* Background image */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500
                           group-hover:scale-110"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20
                              group-hover:from-black/95 group-hover:via-black/60 transition-colors duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                {/* Icon */}
                <motion.div
                  className="w-10 h-10 text-orange mb-3"
                  whileHover={{ rotate: 8, scale: 1.15 }}
                >
                  <cat.icon className="w-full h-full" />
                </motion.div>

                {/* Title */}
                <h3 className="font-rajdhani font-bold text-white text-xl md:text-2xl uppercase tracking-wide mb-2">
                  {cat.title}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
                  {cat.description}
                </p>

                {/* Count */}
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bebas text-3xl md:text-4xl text-orange">
                    {cat.count}
                  </span>
                  <span className="text-white/50 text-sm uppercase tracking-wider">
                    {cat.label}
                  </span>
                </div>
              </div>

              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-orange/30
                              transition-colors duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-white/40 text-sm mb-4">
            Vous ne trouvez pas votre batterie ? Contactez-nous.
          </p>
          <a
            href="tel:+33297492019"
            className="inline-flex items-center gap-2 px-6 py-3
                       text-sm font-semibold uppercase tracking-wider
                       text-white bg-white/10 border border-white/20
                       rounded-full hover:bg-white/20 transition-colors"
          >
            Appelez-nous — 02 97 49 20 19
          </a>
        </motion.div>
      </div>
    </section>
  );
}
