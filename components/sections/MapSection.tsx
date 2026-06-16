"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Navigation, ExternalLink } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const MAP_URL = "https://www.google.com/maps?q=47.679327,-2.771305+(VANNES+BATTERIES)&output=embed&hl=fr&z=18";

export default function MapSection() {
  return (
    <section className="bg-dark-950 py-20 md:py-28 relative overflow-hidden">
      <div className="gradient-overlay absolute inset-0 opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-orange/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-xs font-semibold uppercase tracking-wider text-orange bg-orange/10 border border-orange/30 rounded-full">
            <MapPin className="w-3.5 h-3.5" />
            Nous trouver
          </span>
          <h2 className="font-rajdhani font-bold uppercase tracking-tight text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            VENEZ NOUS RENCONTRER
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Zone de Kerniol, à deux pas du centre de Vannes
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/30"
        >
          <div className="relative w-full h-[350px] sm:h-[400px] md:h-[480px]">
            <iframe
              src={MAP_URL}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(30%) sepia(5%) hue-rotate(200deg) saturate(50%) brightness(1.1)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Plan d'accès Vannes Batteries"
              className="absolute inset-0"
            />

            <div className="absolute inset-0 pointer-events-none bg-dark-950/10" />

            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-dark-950/60 via-transparent to-dark-950/10" />

            <div className="absolute top-4 left-4 md:top-6 md:left-6 pointer-events-auto">
              <div className="px-3 py-1.5 bg-dark-950/70 backdrop-blur-md border border-white/10 rounded-full text-xs text-white/80 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-orange" />
                <span>19 rue Denis Papin, Z.A. de Kerniol</span>
              </div>
            </div>
          </div>

          <div className="relative bg-dark-950/90 backdrop-blur-md border-t border-white/5 px-4 md:px-8 py-4 md:py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange/15 border border-orange/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-orange" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Vannes Batteries</p>
                  <p className="text-muted text-xs">19 rue Denis Papin · 56000 Vannes</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-muted text-xs">
                  <Clock className="w-3 h-3" />
                  <span>Lun–Ven 8h30–18h30</span>
                </div>
                <a
                  href="tel:+33297492019"
                  className="flex items-center gap-2 px-4 py-2.5 bg-orange/20 border border-orange/30 rounded-xl text-orange text-sm font-semibold hover:bg-orange/30 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">02 97 49 20 19</span>
                  <span className="sm:hidden">Appeler</span>
                </a>
                <a
                  href="https://maps.app.goo.gl/9UDu2AUPtbS4d1au7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 text-sm font-semibold hover:bg-blue-600/30 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Google Maps</span>
                  <Navigation className="w-4 h-4 sm:hidden" />
                </a>
                <a
                  href="https://waze.com/ul/hgbqp0zwpc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm font-semibold hover:bg-white/20 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span className="hidden sm:inline">Waze</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}