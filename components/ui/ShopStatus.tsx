"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown } from "lucide-react";

const CLOSING_SOON_MINUTES = 45;

const DAY_LABELS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const OPENING_HOURS: Record<number, { morning: [string, string]; afternoon?: [string, string] } | null> = {
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
    new Date(year, 0, 1),
    new Date(year, 4, 1),
    new Date(year, 4, 8),
    new Date(year, 6, 14),
    new Date(year, 7, 15),
    new Date(year, 10, 1),
    new Date(year, 10, 11),
    new Date(year, 11, 25),
    new Date(easter.getTime() + 86400000),
    new Date(easter.getTime() + 39 * 86400000),
    new Date(easter.getTime() + 50 * 86400000),
  ];
}

function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

type Status = "open" | "closing-soon" | "closed";

function getNextOpenTime(): string {
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const today = now.getDay();

  for (let offset = 0; offset <= 7; offset++) {
    const dayIndex = (today + offset) % 7;
    const schedule = OPENING_HOURS[dayIndex];
    if (!schedule) continue;

    const [mStartH, mStartM] = schedule.morning[0].split(":").map(Number);
    const morningStartMin = mStartH * 60 + mStartM;

    if (offset === 0) {
      if (currentMin < morningStartMin) {
        return `ouvre à ${schedule.morning[0]}`;
      }
      if (schedule.afternoon) {
        const [aStartH, aStartM] = schedule.afternoon[0].split(":").map(Number);
        const afternoonStartMin = aStartH * 60 + aStartM;
        if (currentMin < afternoonStartMin) {
          return `ouvre à ${schedule.afternoon[0]}`;
        }
      }
      continue;
    }

    const label = offset === 1 ? "demain" : DAY_LABELS[dayIndex].toLowerCase();
    return `ouvre ${label} à ${schedule.morning[0]}`;
  }

  return "";
}

function computeStatus(): { status: Status; message: string; reopens: string } {
  const now = new Date();
  const year = now.getFullYear();
  const today = now.getDay();
  const holidays = getFrenchHolidays(year);

  const isHoliday = holidays.some(
    (h) => h.getDate() === now.getDate() && h.getMonth() === now.getMonth() && h.getFullYear() === year
  );

  if (isHoliday) return { status: "closed", message: "Fermé (jour férié)", reopens: getNextOpenTime() };

  const daySchedule = OPENING_HOURS[today];
  if (!daySchedule) return { status: "closed", message: "Fermé", reopens: getNextOpenTime() };

  const currentMin = now.getHours() * 60 + now.getMinutes();

  const [mStartH, mStartM] = daySchedule.morning[0].split(":").map(Number);
  const [mEndH, mEndM] = daySchedule.morning[1].split(":").map(Number);
  const morningStartMin = mStartH * 60 + mStartM;
  const morningEndMin = mEndH * 60 + mEndM;

  if (currentMin >= morningStartMin && currentMin < morningEndMin) {
    const remaining = morningEndMin - currentMin;
    return remaining <= CLOSING_SOON_MINUTES
      ? { status: "closing-soon", message: `Ferme dans ${remaining} min`, reopens: "" }
      : { status: "open", message: "Ouvert", reopens: "" };
  }

  if (daySchedule.afternoon) {
    const [aStartH, aStartM] = daySchedule.afternoon[0].split(":").map(Number);
    const [aEndH, aEndM] = daySchedule.afternoon[1].split(":").map(Number);
    const afternoonStartMin = aStartH * 60 + aStartM;
    const afternoonEndMin = aEndH * 60 + aEndM;

    if (currentMin >= afternoonStartMin && currentMin < afternoonEndMin) {
      const remaining = afternoonEndMin - currentMin;
      return remaining <= CLOSING_SOON_MINUTES
        ? { status: "closing-soon", message: `Ferme dans ${remaining} min`, reopens: "" }
        : { status: "open", message: "Ouvert", reopens: "" };
    }
  }

  return { status: "closed", message: "Fermé", reopens: getNextOpenTime() };
}

function isHolidayToday(): boolean {
  const now = new Date();
  const holidays = getFrenchHolidays(now.getFullYear());
  return holidays.some(
    (h) => h.getDate() === now.getDate() && h.getMonth() === now.getMonth() && h.getFullYear() === now.getFullYear()
  );
}

function formatSchedule(day: number): string {
  const schedule = OPENING_HOURS[day];
  if (!schedule) return "Fermé";
  const parts = [`${schedule.morning[0]}–${schedule.morning[1]}`];
  if (schedule.afternoon) parts.push(`${schedule.afternoon[0]}–${schedule.afternoon[1]}`);
  return parts.join(" / ");
}

interface ShopStatusProps {
  compact?: boolean;
  showIcon?: boolean;
}

export default function ShopStatus({ compact = false, showIcon = true }: ShopStatusProps) {
  const [status, setStatus] = useState<Status>("closed");
  const [message, setMessage] = useState("Fermé");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const result = computeStatus();
      setStatus(result.status);
      setMessage(result.message);
    };
    update();
    const interval = setInterval(update, 30000);
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

  const badge = (
    <>
      {showIcon && <span className={`w-2 h-2 rounded-full ${c.dot} ${status === "open" ? "animate-pulse" : ""}`} />}
      <span className={`text-xs font-semibold ${c.text}`}>{message}</span>
      <ChevronDown className={`w-3 h-3 ${c.text} transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </>
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

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-64 z-50"
            >
              <div className="bg-dark-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange" />
                  <span className="text-white text-xs font-semibold uppercase tracking-wide">Horaires d&apos;ouverture</span>
                </div>
                <div className="p-3 space-y-0.5">
                  {DAY_LABELS.map((label, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] ${
                        i === today ? "bg-orange/10 border border-orange/20" : ""
                      }`}
                    >
                      <span className={`font-medium ${i === today ? "text-orange" : "text-gray-400"}`}>{label}</span>
                      <span className={`${i === today ? "text-orange font-semibold" : "text-gray-500"}`}>
                        {formatSchedule(i)}
                      </span>
                    </div>
                  ))}
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
                <span className="text-white text-sm font-semibold uppercase tracking-wide">Horaires d&apos;ouverture</span>
              </div>
              <div className="p-3 space-y-0.5">
                {DAY_LABELS.map((label, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${
                      i === today ? "bg-orange/10 border border-orange/20" : ""
                    }`}
                  >
                    <span className={`font-medium ${i === today ? "text-orange" : "text-gray-400"}`}>{label}</span>
                    <span className={`${i === today ? "text-orange font-semibold" : "text-gray-500"}`}>
                      {formatSchedule(i)}
                    </span>
                  </div>
                ))}
              </div>
              {isHolidayToday() && (
                <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 text-red-400 text-xs font-semibold text-center uppercase">
                  Jour férié aujourd&apos;hui
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}