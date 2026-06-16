"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useI18n } from "@/lib/i18n/context";
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  ExternalLink,
  Route,
  Loader2,
} from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const CENTER = { lat: 47.679327, lng: -2.771305 };

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0B132B" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#0d1b2a" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1b2838" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6f9ba5" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1c2e42" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b0" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2c3e50" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#7b8a96" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4e6d70" }] },
];

const mapContainerStyle = { width: "100%", height: "100%" };

export default function MapSection() {
  const { t } = useI18n();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "",
  });

  const [showInfo, setShowInfo] = useState(false);
  const [ directions, setDirections ] = useState<string | null>(null);
  const [ loadingDir, setLoadingDir ] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const getDirections = useCallback(() => {
    if (!navigator.geolocation) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${CENTER.lat},${CENTER.lng}`,
        "_blank"
      );
      return;
    }
    setLoadingDir(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const origin = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
          {
            origin,
            destination: CENTER,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            setLoadingDir(false);
            if (status === "OK" && result?.routes[0]) {
              const leg = result.routes[0].legs[0];
              setDirections(`${leg.distance?.text} · ${leg.duration?.text}`);
              mapRef.current?.panTo(origin);
              mapRef.current?.setZoom(12);
            } else {
              window.open(
                `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${CENTER.lat},${CENTER.lng}`,
                "_blank"
              );
            }
          }
        );
      },
      () => {
        setLoadingDir(false);
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${CENTER.lat},${CENTER.lng}`,
          "_blank"
        );
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  if (loadError) {
    return (
      <section className="bg-dark-950 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted">
          <p>Erreur de chargement de la carte.</p>
        </div>
      </section>
    );
  }

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
            {t.map.badge}
          </span>
          <h2 className="font-rajdhani font-bold uppercase tracking-tight text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            {t.map.title}
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            {t.map.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/30"
        >
          {/* Map */}
          <div className="relative w-full h-[350px] sm:h-[400px] md:h-[480px]">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={CENTER}
                zoom={16}
                onLoad={onMapLoad}
                options={{
                  styles: DARK_MAP_STYLE,
                  disableDefaultUI: true,
                  zoomControl: true,
                  mapTypeControl: false,
                  streetViewControl: false,
                  fullscreenControl: true,
                  gestureHandling: "greedy",
                }}
              >
                <Marker
                  position={CENTER}
                  onClick={() => setShowInfo(true)}
                  icon={{
                    url: "/media/LOGO 56 et miniature.jpg",
                    scaledSize: new google.maps.Size(48, 48),
                    anchor: new google.maps.Point(24, 24),
                  }}
                />

                {showInfo && (
                  <InfoWindow
                    position={CENTER}
                    onCloseClick={() => setShowInfo(false)}
                    options={{
                      pixelOffset: new google.maps.Size(0, -24),
                    }}
                  >
                    <div className="bg-dark-950 text-white p-4 rounded-xl min-w-[220px] font-sans">
                      <p className="font-bold text-base mb-1">VANNES BATTERIES</p>
                      <p className="text-white/60 text-sm mb-3">19 rue Denis Papin, 56000 Vannes</p>
                      {directions && (
                        <p className="text-orange text-sm font-semibold mb-3">
                          <Route className="w-4 h-4 inline mr-1" />
                          {directions}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <a
                          href="tel:+33297492019"
                          className="flex items-center gap-1 px-3 py-1.5 bg-orange/20 border border-orange/30 rounded-lg text-orange text-xs font-semibold"
                        >
                          <Phone className="w-3 h-3" /> Appeler
                        </a>
                        <a
                          href="https://maps.app.goo.gl/9UDu2AUPtbS4d1au7"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-semibold"
                        >
                          <ExternalLink className="w-3 h-3" /> Maps
                        </a>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div className="absolute inset-0 bg-dark-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange animate-spin" />
              </div>
            )}

            {/* Overlays */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-dark-950/60 via-transparent to-dark-950/10" />

            {/* Address badge */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 pointer-events-auto">
              <div className="px-3 py-1.5 bg-dark-950/70 backdrop-blur-md border border-white/10 rounded-full text-xs text-white/80 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-orange" />
                <span>{t.map.address}</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative bg-dark-950/90 backdrop-blur-md border-t border-white/5 px-4 md:px-8 py-4 md:py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange/15 border border-orange/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-orange" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Vannes Batteries</p>
                  <p className="text-muted text-xs">{t.map.addressFull}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-muted text-xs">
                  <Clock className="w-3 h-3" />
                  <span>Lun–Ven 8h30–18h30</span>
                </div>
                <button
                  onClick={getDirections}
                  disabled={loadingDir}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-semibold hover:bg-emerald-600/30 transition-all disabled:opacity-50"
                >
                  {loadingDir ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Route className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">{t.map.directions}</span>
                </button>
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
