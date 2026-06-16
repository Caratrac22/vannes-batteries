// ============================================================
// VANNES BATTERIES — À Propos Page (/a-propos)
// ============================================================

"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, MapPin, Eye } from "lucide-react";
import { staggerContainerFast, fadeInUp } from "@/lib/animations";
import Lightbox from "@/components/ui/Lightbox";

interface GalleryImage {
  src: string;
  alt: string;
}

interface Category {
  title: string;
  images: GalleryImage[];
  placeholderCount?: number;
}

const categories: Category[] = [
  {
    title: "Batterie de voilier et bateau moteur",
    images: [
      { src: "/media/voilier.jpg", alt: "Voilier équipé d'une batterie marine" },
      { src: "/media/boat 2.jpg", alt: "Bateau à moteur hors-bord" },
      { src: "/media/cost guard.jpg", alt: "Bateau de secours en mer" },
      { src: "/media/HR48.jpg", alt: "Voilier hauturier" },
      { src: "/media/AGM 120.png", alt: "Batterie décharge lente AGM 120Ah" },
    ],
  },
  {
    title: "Pose de votre batterie",
    images: [
      { src: "/media/pose batterie.jpg", alt: "Installation d'une batterie voiture sous le capot" },
      { src: "/media/pose batterie .2.jpg", alt: "Remplacement de batterie par un technicien qualifié" },
    ],
    placeholderCount: 1, // Ready frame for future shop photos
  },
  {
    title: "Pose de batteries camping-car",
    images: [
      { src: "/media/camping car mercedes.png", alt: "Camping-car équipé d'un parc de batteries auxiliaires" },
    ],
    placeholderCount: 2, // Space dedicated for future installations
  },
  {
    title: "Batterie moto",
    images: [
      { src: "/media/moto.png", alt: "Moto équipée de batteries professionnelles" },
    ],
    placeholderCount: 2,
  },
  {
    title: "Batterie Poids-Lourds · TP · Agricole",
    images: [
      { src: "/media/photo TP.jpg", alt: "Pelle mécanique de chantier (TP)" },
      { src: "/media/tracteur.jpg", alt: "Tracteur agricole équipé de batteries professionnelles" },
      { src: "/media/AP-AGM50-900.jpg", alt: "Batterie professionnelle de démarrage TP AP-AGM50" },
      { src: "/media/AGML5 (2).jpg", alt: "Batterie AGM pour matériel agricole" },
    ],
  },
  {
    title: "Batteries voitures",
    images: [
      { src: "/media/Porsche 997.jpg", alt: "Porsche 911 (Type 997)" },
      { src: "/media/ferrari california.jpg", alt: "Ferrari California rouge" },
      { src: "/media/corvette c7.jfif", alt: "Chevrolet Corvette C7 Stingray" },
      { src: "/media/porche vintage rouge anciene vue de arriere droite.jpg", alt: "Porsche vintage classique de collection" },
      { src: "/media/vue arriere gauche de la porche.jpg", alt: "Détail arrière gauche Porsche classique" },
      { src: "/media/facade.1.jpg", alt: "Devanture et parking du magasin Vannes Batteries" },
    ],
  },
];

export default function AProposPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allImages = useMemo(
    () => categories.flatMap((cat) => cat.images),
    []
  );

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  }, [allImages.length]);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  }, [allImages.length]);

  // Compute imageIndex offset per category for correct lightbox indexing
  const getGlobalIndex = (catIdx: number, imgIdx: number) => {
    let offset = 0;
    for (let i = 0; i < catIdx; i++) {
      offset += categories[i].images.length;
    }
    return offset + imgIdx;
  };
  return (
    <>
      {/* ── Page Header ───────────────────────────────────── */}
      <section className="bg-dark-950 pt-32 pb-16 relative overflow-hidden">
        <div className="gradient-overlay absolute inset-0 opacity-50" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="font-rajdhani font-bold uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl text-white mb-6">
            À PROPOS DE NOUS
          </h1>
          <a
            href="https://maps.app.goo.gl/9UDu2AUPtbS4d1au7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-orange hover:text-orange-400 transition-colors text-lg"
          >
            <MapPin className="w-5 h-5" />
            Z.A. de Kerniol, proche clinique Océane
          </a>
        </div>
      </section>

      {/* ── Photo Galleries ───────────────────────────────── */}
      <section className="bg-light-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {categories.map((category, catIdx) => (
              <div key={category.title}>
                <h2 className="font-rajdhani font-bold text-2xl uppercase text-dark-950 mb-6 border-b border-gray-200 pb-2">
                  {category.title}
                </h2>
                <motion.div
                  variants={staggerContainerFast}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {/* Real Images */}
                  {category.images.map((image, i) => {
                    const globalIdx = getGlobalIndex(catIdx, i);
                    return (
                      <motion.div
                        key={`img-${catIdx}-${i}`}
                        variants={fadeInUp}
                        onClick={() => openLightbox(globalIdx)}
                        className="group relative aspect-square bg-dark-950 rounded-xl overflow-hidden border border-gray-200/50 hover:border-orange/50 transition-all duration-300 shadow-sm hover:shadow-orange-hover cursor-pointer"
                      >
                        {/* Image tag with lazy loading */}
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Dark glassmorphism overlay on hover */}
                        <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <div className="flex items-center gap-2 text-orange mb-1 text-xs font-semibold uppercase tracking-wider font-rajdhani">
                            <Eye className="w-4 h-4" />
                            <span>Agrandir</span>
                          </div>
                          <p className="text-white text-xs leading-normal font-medium line-clamp-2">
                            {image.alt}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Dedicated Placeholder Frames for future photos */}
                  {[...Array(category.placeholderCount || 0)].map((_, i) => (
                    <motion.div
                      key={`place-${i}`}
                      variants={fadeInUp}
                      className="relative aspect-square bg-white border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-orange hover:border-orange/50 hover:bg-orange/5 transition-all duration-300 group cursor-pointer"
                    >
                      <Camera className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold uppercase tracking-wider font-rajdhani">
                        Cadre Dédié
                      </span>
                      <span className="text-[10px] opacity-75">
                        Emplacement Photo {category.images.length + i + 1}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        images={allImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </>
  );
}
