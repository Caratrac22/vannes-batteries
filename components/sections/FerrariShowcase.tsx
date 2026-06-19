"use client";

import Image from "next/image";

export default function FerrariShowcase() {
  return (
    <section
      className="relative h-[45vh] md:h-[55vh] lg:h-[65vh] overflow-hidden bg-slate-100"
      aria-label="Véhicule d'exception"
    >
      <div className="absolute inset-0">
        <Image
          src="/media/ferrari california.jpg"
          alt="Ferrari California rouge équipée par Vannes Batteries"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_75%] brightness-105"
        />
      </div>
    </section>
  );
}
