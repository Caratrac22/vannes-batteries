"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const MapSection = dynamic(() => import("@/components/sections/MapSection"), { ssr: false });

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  );
}

function MapSkeleton() {
  return (
    <section className="bg-dark-900 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SkeletonBlock className="h-6 w-48 mx-auto mb-4 rounded-full" />
          <SkeletonBlock className="h-10 w-96 mx-auto" />
        </div>
        <SkeletonBlock className="h-[400px] rounded-2xl" />
      </div>
    </section>
  );
}

export default function LazySections() {
  return (
    <Suspense fallback={<MapSkeleton />}>
      <MapSection />
    </Suspense>
  );
}
