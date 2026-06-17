"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const Reviews = dynamic(() => import("@/components/sections/Reviews"), { ssr: false });
const MapSection = dynamic(() => import("@/components/sections/MapSection"), { ssr: false });

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  );
}

function ReviewsSkeleton() {
  return (
    <section className="bg-dark-950 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SkeletonBlock className="h-6 w-48 mx-auto mb-4 rounded-full" />
          <SkeletonBlock className="h-10 w-80 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
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
    <>
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews />
      </Suspense>
      <Suspense fallback={<MapSkeleton />}>
        <MapSection />
      </Suspense>
    </>
  );
}
