"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { StarIcon } from "@/components/ui/icons";
import { staggerContainerFast, fadeInUp } from "@/lib/animations";

interface Review {
  name: string;
  text: string;
  rating: number;
  time: string;
  profilePhoto: string;
}

interface ReviewsData {
  rating: number;
  totalReviews: number;
  reviews: Review[];
}

const fallbackReviews: Review[] = [
  {
    name: "Stéphanie M.",
    text: "Je recommande vivement ce professionnel qui saura vous donner des conseils avisés et proposer des solutions de qualité et compétitives.",
    rating: 5,
    time: "Janvier 2024",
    profilePhoto: "",
  },
  {
    name: "Nannooshka",
    text: "Venue ce matin pour changer ma batterie. On m'avait conseillé ce magasin et je n'ai pas été déçue ! Très bon accueil.",
    rating: 5,
    time: "Janvier 2024",
    profilePhoto: "",
  },
  {
    name: "Nicolas A.",
    text: "Tarifs nickel, conseils top. Vous pouvez y aller les yeux fermés !",
    rating: 5,
    time: "Février 2024",
    profilePhoto: "",
  },
  {
    name: "Frédéric R.",
    text: "Le gérant connaît très bien ses produits et m'a parfaitement conseillé pour mon Peugeot Métropolis. 20/20, je recommande vivement.",
    rating: 5,
    time: "Mars 2024",
    profilePhoto: "",
  },
  {
    name: "Xavier",
    text: "Le professionnalisme est remarquable. Le changement d'une batterie n'est pas aussi simple qu'on le croit avec l'électronique embarquée. Très ravi.",
    rating: 5,
    time: "Mars 2024",
    profilePhoto: "",
  },
];

export default function Reviews() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const [data, setData] = useState<ReviewsData>({
    rating: 5,
    totalReviews: 177,
    reviews: fallbackReviews,
  });

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => {
        if (d.rating && d.reviews?.length) {
          setData({
            rating: d.rating,
            totalReviews: d.totalReviews,
            reviews: d.reviews.map((r: Review) => ({
              ...r,
              text: r.text || "Avis non disponible",
            })),
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="avis" className="bg-dark-950 py-20 md:py-28 relative overflow-hidden" aria-label="Avis clients" ref={containerRef}>
      <div className="gradient-overlay absolute inset-0 opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          badge={`${data.totalReviews} avis vérifiés`}
          badgeIcon={StarIcon}
          title="Ce que disent nos clients"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${i <= Math.round(data.rating) ? "text-yellow fill-yellow" : "text-gray-600"}`}
              />
            ))}
          </div>
          <span className="text-white font-rajdhani font-bold text-2xl">{data.rating.toFixed(1)}</span>
          <span className="text-muted text-sm">/ 5</span>
        </motion.div>

        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          style={{ y: y1 }}
          className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar
                     md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 md:snap-none"
        >
          {data.reviews.map((review, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="min-w-[85vw] sm:min-w-[400px] md:min-w-0 snap-center mr-4 md:mr-0
                         glass-card p-6 md:p-8 flex flex-col justify-between"
              whileHover={{ rotateX: 2, rotateY: -2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${s <= review.rating ? "text-yellow fill-yellow" : "text-gray-600"}`}
                    />
                  ))}
                </div>
                <p className="text-muted text-sm leading-relaxed mb-6 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 flex items-center gap-3">
                {review.profilePhoto ? (
                  <img
                    src={review.profilePhoto}
                    alt={review.name}
                    className="w-8 h-8 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-orange/20 flex items-center justify-center text-orange text-xs font-bold">
                    {review.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-rajdhani font-bold text-white tracking-wide">{review.name}</p>
                  <p className="text-xs text-muted">{review.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row justify-center gap-4"
        >
          <a
            href="https://maps.app.goo.gl/9UDu2AUPtbS4d1au7"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <Star className="w-4 h-4 fill-white" />
            Laisser un avis Google
          </a>
          <a
            href="https://maps.app.goo.gl/9UDu2AUPtbS4d1au7"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Voir tous les avis ({data.totalReviews})
          </a>
        </motion.div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}