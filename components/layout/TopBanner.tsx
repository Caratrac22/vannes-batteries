"use client";

import { Zap } from "lucide-react";

export default function TopBanner() {
  return (
    <div className="hidden md:flex items-center justify-center h-9 bg-gradient-to-r from-orange-700 via-orange to-orange-600 text-white text-xs font-semibold uppercase tracking-widest gap-2">
      <Zap className="w-3.5 h-3.5" />
      <span>Professionnel de la batterie depuis plus de 30 ans</span>
      <Zap className="w-3.5 h-3.5" />
    </div>
  );
}
