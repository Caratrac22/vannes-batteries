"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown } from "lucide-react";

type Status = "open" | "closing-soon" | "closed";

interface HoursData {
  isOpenNow: boolean | null;
  currentDay: string[];
  regularHours: string[];
  businessStatus: string;
  error?: string;
}

const DAY_LABELS_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const FALLBACK_HOURS: Record<number, { morning: [string, string]; afternoon?: [string, string] } | null> = {
  0: null,
  1: { morning: ["08:30", "12:00"], afternoon: ["14:00", "18:30"] },
  2: { morning: ["08:30", "12:00"], afternoon: ["14:00", "18:30"] },
  3: { morning: ["08:30", "12:00"], afternoon: ["14:00", "18:30"] },
  4: { morning: ["08:30", "12:00"], afternoon: ["14:00", "18:30"] },
  5: { morning: ["08:30", "12:00"], afternoon: ["14:00", "18:30"] },
  6: { morning: ["09:00", "12:00"] },
};

function getFrenchHolidays(year: number): Date[] {
  const easter = getEasterDate(year);
  return [
    new Date(year, 0, 1), new Date(year, 4, 1), new Date(year, 4, 8),
    new Date(year, 6, 14), new Date(year, 7, 15), new Date(year, 10, 1),
    new Date(year, 10, 11), new Date(year, 11, 25),
    new Date(easter.getTime() + 86400000),
    new Date(easter.getTime() + 39 * 86400000),
    new Date(easter.getTime() + 50 * 86400000),
  ];
}

function getEasterDate(year: number): Date {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function isHolidayToday(): boolean {
  const now = new Date();
  const holidays = getFrenchHolidays(now.getFullYear());
  return holidays.some(
    (h) => h.getDate() === now.getDate() && h.getMonth() === now.getMonth() && h.getFullYear() === now.getFullYear()
  );
}

function parseGoogleHours(descriptions: string[]): Record<number, string> {
  const result: Record<number, string> = {};
  const dayMap = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  descriptions.forEach((desc) => {
    for (let i = 0; i < dayMap.length; i++) {
      if (desc.startsWith(dayMap[i])) {
        const hours = desc.replace(`${dayMap[i]}: `, "").trim();
        result[i] = hours === "Fermé" ? "Fermé" : hours;
      }
    }
  });

  return result;
}

function getNextOpenTimeGoogle(regularHours: Record<number, string>): string {
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const today = now.getDay();

  for (let offset = 0; offset <= 7; offset++) {
    const dayIndex = (today + offset) % 7;
    const hours = regularHours[dayIndex];
    if (!hours || hours === "Fermé") continue;

    const periods = hours.split(", ");
    for (const period of periods) {
      const match = period.match(/(\d{1,2}:\d{2})/);
      if (match) {
        const [h, m] = match[1].split(":").map(Number);
        const startMin = h * 60 + m;
        if (offset === 0 && currentMin < startMin) {
          return `ouvre à ${match[1]}`;
        }
        if (offset > 0) {
          const label = offset === 1 ? "demain" : DAY_LABELS_FR[dayIndex].toLowerCase();
          return `ouvre ${label} à ${match[1]}`;
        }
      }
    }
  }
  return "";
}

function getStatusFromGoogle(data: HoursData): { status: Status; message: string; reopens: string } {
  if (data.businessStatus !== "OPERATIONAL") {
    return { status: "closed", message: "Fermé", reopens: "" };
  }

  if (isHolidayToday()) {
    return { status: "closed", message: "Fermé (jour férié)", reopens: "" };
  }

  if (data.isOpenNow === true) {
    return { status: "open", message: "Ouvert", reopens: "" };
  }

  if (data.isOpenNow === false) {
    const regularParsed = parseGoogleHours(data.regularHours);
    const reopens = getNextOpenTimeGoogle(regularParsed);
    return { status: "closed", message: "Fermé", reopens };
  }

  return { status: "closed", message: "Fermé", reopens: "" };
}

function getFallbackStatus(): { status: Status; message: string; reopens: string } {
  const now = new Date();
  const today = now.getDay();
  const currentMin = now.getHours() * 60 + now.getMinutes();

  if (isHolidayToday()) return { status: "closed", message: "Fermé (jour férié)", reopens: "" };

  const schedule = FALLBACK_HOURS[today];
  if (!schedule) return { status: "closed", message: "Fermé", reopens: "ouvre demain à 08:30" };

  const [mH, mM] = schedule.morning[0].split(":").map(Number);
  const [mEH, mEM] = schedule.morning[1].split(":").map(Number);
  const morningStart = mH * 60 + mM;
  const morningEnd = mEH * 60 + mEM;

  if (currentMin >= morningStart && currentMin < morningEnd) {
    const remaining = morningEnd - currentMin;
    return remaining <= 45
      ? { status: "closing-soon", message: `Ferme dans ${remaining} min`, reopens: "" }
      : { status: "open", message: "Ouvert", reopens: "" };
  }

  if (schedule.afternoon) {
    const [aH, aM] = schedule.afternoon[0].split(":").map(Number);
    const [aEH, aEM] = schedule.afternoon[1].split(":").map(Number);
    const afternoonStart = aH * 60 + aM;
    const afternoonEnd = aEH * 60 + aEM;

    if (currentMin >= afternoonStart && currentMin < afternoonEnd) {
      const remaining = afternoonEnd - currentMin;
      return remaining <= 45
        ? { status: "closing-soon", message: `Ferme dans ${remaining} min`, reopens: "" }
        : { status: "open", message: "Ouvert", reopens: "" };
    }
  }

  return { status: "closed", message: "Fermé", reopens: "ouvre demain à 08:30" };
}

interface ShopStatusProps {
  compact?: boolean;
  showIcon?: boolean;
}

export default function ShopStatus({ compact = false, showIcon = true }: ShopStatusProps) {
  const [status, setStatus] = useState<Status>("closed");
  const [message, setMessage] = useState("Fermé");
  const [reopens, setReopens] = useState("");
  const [googleHours, setGoogleHours] = useState<Record<number, string> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const saved = localStorage.getItem("vb-hours-cache") as string | null;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Date.now() - parsed.ts < 30 * 60 * 1000) {
            const result = getStatusFromGoogle(parsed.data);
            setStatus(result.status);
            setMessage(result.message);
            setReopens(result.reopens);
            setGoogleHours(parseGoogleHours(parsed.data.regularHours));
            return;
          }
        } catch {}
      }

      fetch("/api/hours")
        .then((r) => r.json())
        .then((data: HoursData) => {
          if (data.error) throw new Error(data.error);
          localStorage.setItem("vb-hours-cache", JSON.stringify({ data, ts: Date.now() }));
          const result = getStatusFromGoogle(data);
          setStatus(result.status);
          setMessage(result.message);
          setReopens(result.reopens);
          setGoogleHours(parseGoogleHours(data.regularHours));
        })
        .catch(() => {
          const fb = getFallbackStatus();
          setStatus(fb.status);
          setMessage(fb.message);
          setReopens(fb.reopens);
        });
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const colors = {
    open: { dot: "bg-green-500", text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
    "closing-soon": { dot: "bg-orange-500", text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
    closed: { dot: "bg-red-500", text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
  };

  const c = colors[status];
  const today = new Date().getDay();

  const formatDay = (dayIndex: number, hours: string): string => {
    if (hours === "Fermé" || !hours) return "Fermé";
    return hours.replace(" – ", "–").replace(" – ", "–");
  };

  const badge = (
    <>
      {showIcon && <span className={`w-2 h-2 rounded-full ${c.dot} ${status === "open" ? "animate-pulse" : ""}`} />}
      <span className={`text-xs font-semibold ${c.text}`}>{message}</span>
      {reopens && status === "closed" && (
        <span className="text-[10px] text-gray-500 hidden sm:inline">({reopens})</span>
      )}
      <ChevronDown className={`w-3 h-3 ${c.text} transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </>
  );

  const hoursDropdown = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 mt-2 w-72 z-50"
        >
          <div className="bg-dark-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange" />
              <span className="text-white text-xs font-semibold uppercase tracking-wide">Horaires d&apos;ouverture</span>
            </div>
            <div className="p-3 space-y-0.5">
              {DAY_LABELS_FR.map((label, i) => {
                const hours = googleHours?.[i] ?? formatDay(i, "");
                const isToday = i === today;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] ${
                      isToday ? "bg-orange/10 border border-orange/20" : ""
                    }`}
                  >
                    <span className={`font-medium ${isToday ? "text-orange" : "text-gray-400"}`}>{label}</span>
                    <span className={`${isToday ? "text-orange font-semibold" : "text-gray-500"}`}>
                      {hours || "Fermé"}
                    </span>
                  </div>
                );
              })}
            </div>
            {isHolidayToday() && (
              <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 text-red-400 text-[10px] font-semibold text-center uppercase">
                Jour férié aujourd&apos;hui
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (compact) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.border} border ${c.text} cursor-pointer hover:brightness-110 transition-all`}
        >
          {badge}
        </button>
        {hoursDropdown}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${c.border} ${c.bg} cursor-pointer hover:brightness-110 transition-all`}
      >
        {badge}
      </button>
      {hoursDropdown}
    </div>
  );
}
