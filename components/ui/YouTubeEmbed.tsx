"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export default function YouTubeEmbed({ videoId, title: defaultTitle }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const [videoTitle, setVideoTitle] = useState(defaultTitle || "");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  useEffect(() => {
    fetch(`/api/youtube/info?id=${videoId}`)
      .then((r) => r.json())
      .then((d) => { if (d.title) setVideoTitle(d.title); })
      .catch(() => {});
  }, [videoId]);

  useEffect(() => {
    if (playing) return;
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlaying(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [playing]);

  return (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden
                 shadow-[0_0_15px_rgba(0,210,255,0.1)]
                 border border-white/5 group"
    >
      <div className="relative aspect-video bg-dark-900">
        {!playing ? (
          <div className="absolute inset-0">
            <img
              src={thumbnailUrl}
              alt={videoTitle || "Vidéo VANNES BATTERIES"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-dark-950/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full
                             bg-orange/90 backdrop-blur-sm flex items-center justify-center
                             shadow-[0_0_12px_rgba(220,38,38,0.3)]">
                <Play className="w-7 h-7 md:w-8 md:h-8 text-white ml-1" />
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={videoTitle || "Vidéo VANNES BATTERIES"}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </motion.div>
        )}
      </div>
      {videoTitle && (
        <div className="px-4 py-3 bg-dark-800/80 backdrop-blur-sm border-t border-white/5">
          <p className="text-sm text-white/60 font-medium truncate">{videoTitle}</p>
        </div>
      )}
    </motion.div>
  );
}
