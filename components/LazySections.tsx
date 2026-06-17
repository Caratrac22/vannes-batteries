"use client";

import dynamic from "next/dynamic";

const Reviews = dynamic(() => import("@/components/sections/Reviews"), { ssr: false });
const MapSection = dynamic(() => import("@/components/sections/MapSection"), { ssr: false });

export default function LazySections() {
  return (
    <>
      <Reviews />
      <MapSection />
    </>
  );
}
