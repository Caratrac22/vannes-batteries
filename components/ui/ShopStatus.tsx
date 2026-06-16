"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

type Status = "open" | "closing-soon" | "closed";

interface HoursData {
  isOpenNow: boolean | null;
  currentDay: string[];
  regularHours: string[];
  businessStatus: string;
  error?: string;
}

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

const GOOGLE_DAY_MAP = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function parseGoogleHours(descriptions: string[]): Record<number, string> {
  const result: Record<number, string> = {};
  descriptions.forEach((desc) => {
    const lower = desc.toLowerCase();
    for (let i = 0; i < GOOGLE_DAY_MAP.length; i++) {
      if (lower.startsWith(GOOGLE_DAY_MAP[i].toLowerCase())) {
        const hours = desc.replace(/^[^:]+:\s*/, "").trim();
        result[i] = hours === "Fermé" ? "Fermé" : hours;
      }
    }
  });
  return result;
}

function getClosingMinutes(regularHours: Record<number, string>): number | null {
  const now = new Date();
  const today = now.getDay();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const hours = regularHours[today];
  if (!hours || hours === "Fermé") return null;

  const periods = hours.split(/,\s*/);
  for (const period of periods) {
    const times = period.match(/(\d{1,2}:\d{2})\s*[\u2013\u2014\-–]\s*(\d{1,2}:\d{2})/);
    if (!times) continue;
    const [sh, sm] = times[1].split(":").map(Number);
    const [eh, em] = times[2].split(":").map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    if (currentMin >= start && currentMin < end) {
      return end - currentMin;
    }
  }
  return null;
}

function getNextOpenTimeInfo(regularHours: Record<number, string>, dayNames: string[]): { opensAt?: string; day?: string } | null {
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const today = now.getDay();

  for (let offset = 0; offset <= 7; offset++) {
    const dayIndex = (today + offset) % 7;
    const hours = regularHours[dayIndex];
    if (!hours || hours === "Fermé") continue;

    const periods = hours.split(/,\s*/);
    for (const period of periods) {
      const match = period.match(/(\d{1,2}:\d{2})/);
      if (match) {
        const [h, m] = match[1].split(":").map(Number);
        const startMin = h * 60 + m;
        if (offset === 0 && currentMin < startMin) {
          return { opensAt: match[1] };
        }
        if (offset > 0) {
          return { opensAt: match[1], day: offset === 1 ? "tomorrow" : dayNames[dayIndex].toLowerCase() };
        }
      }
    }
  }
  return null;
}

function getStatusFromGoogle(data: HoursData): { status: Status; isHoliday: boolean; closingMinutes?: number; nextOpen: { opensAt?: string; day?: string } | null } {
  if (data.businessStatus !== "OPERATIONAL") {
    return { status: "closed", isHoliday: false, nextOpen: null };
  }

  if (isHolidayToday()) {
    return { status: "closed", isHoliday: true, nextOpen: null };
  }

  if (data.isOpenNow === true) {
    const regularParsed = parseGoogleHours(data.regularHours);
    const closingMinutes = getClosingMinutes(regularParsed) ?? undefined;
    if (closingMinutes !== undefined && closingMinutes <= 45) {
      return { status: "closing-soon", isHoliday: false, closingMinutes, nextOpen: null };
    }
    return { status: "open", isHoliday: false, nextOpen: null };
  }

  if (data.isOpenNow === false) {
    const regularParsed = parseGoogleHours(data.regularHours);
    const nextOpen = getNextOpenTimeInfo(regularParsed, GOOGLE_DAY_MAP);
    return { status: "closed", isHoliday: false, nextOpen };
  }

  return { status: "closed", isHoliday: false, nextOpen: null };
}

function getFallbackStatus(): { status: Status; closingMinutes?: number; nextOpen: { opensAt?: string; day?: string } | null } {
  const now = new Date();
  const today = now.getDay();
  const currentMin = now.getHours() * 60 + now.getMinutes();

  if (isHolidayToday()) return { status: "closed", nextOpen: null };

  const schedule = FALLBACK_HOURS[today];
  if (!schedule) return { status: "closed", nextOpen: { opensAt: "08:30", day: "tomorrow" } };

  const [mH, mM] = schedule.morning[0].split(":").map(Number);
  const [mEH, mEM] = schedule.morning[1].split(":").map(Number);
  const morningStart = mH * 60 + mM;
  const morningEnd = mEH * 60 + mEM;

  if (currentMin >= morningStart && currentMin < morningEnd) {
    const remaining = morningEnd - currentMin;
    return remaining <= 45
      ? { status: "closing-soon", closingMinutes: remaining, nextOpen: null }
      : { status: "open", nextOpen: null };
  }

  if (schedule.afternoon) {
    const [aH, aM] = schedule.afternoon[0].split(":").map(Number);
    const [aEH, aEM] = schedule.afternoon[1].split(":").map(Number);
    const afternoonStart = aH * 60 + aM;
    const afternoonEnd = aEH * 60 + aEM;

    if (currentMin >= afternoonStart && currentMin < afternoonEnd) {
      const remaining = afternoonEnd - currentMin;
      return remaining <= 45
        ? { status: "closing-soon", closingMinutes: remaining, nextOpen: null }
        : { status: "open", nextOpen: null };
    }
  }

  return { status: "closed", nextOpen: { opensAt: "08:30", day: "tomorrow" } };
}

interface ShopStatusProps {
  compact?: boolean;
  showIcon?: boolean;
}

export default function ShopStatus({ compact = false, showIcon = true }: ShopStatusProps) {
  const { t } = useI18n();
  const ts = t.shopStatus;
  const dayNames = ts.dayNames;

  const [status, setStatus] = useState<Status>("closed");
  const [message, setMessage] = useState(ts.closed);
  const [reopens, setReopens] = useState("");
  const [isHoliday, setIsHoliday] = useState(false);
  const [googleHours, setGoogleHours] = useState<Record<number, string> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const formatMessage = (s: Status, closingMinutes?: number, nextOpen?: { opensAt?: string; day?: string } | null, holiday?: boolean) => {
    if (holiday) return ts.closedHoliday;
    if (s === "closing-soon" && closingMinutes) return ts.closingSoon.replace("{min}", String(closingMinutes));
    if (s === "open") return ts.open;
    return ts.closed;
  };

  const formatReopens = (nextOpen: { opensAt?: string; day?: string } | null) => {
    if (!nextOpen) return "";
    if (!nextOpen.day) return ts.opensAt.replace("{time}", nextOpen.opensAt || "");
    if (nextOpen.day === "tomorrow") return ts.opensTomorrow.replace("{time}", nextOpen.opensAt || "");
    return ts.opensDay.replace("{day}", nextOpen.day).replace("{time}", nextOpen.opensAt || "");
  };

  useEffect(() => {
    const update = () => {
      const saved = localStorage.getItem("vb-hours-cache") as string | null;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Date.now() - parsed.ts < 30 * 60 * 1000) {
            const result = getStatusFromGoogle(parsed.data);
            setStatus(result.status);
            setIsHoliday(result.isHoliday);
            setMessage(formatMessage(result.status, result.closingMinutes, result.nextOpen, result.isHoliday));
            setReopens(formatReopens(result.nextOpen));
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
          setIsHoliday(result.isHoliday);
          setMessage(formatMessage(result.status, result.closingMinutes, result.nextOpen, result.isHoliday));
          setReopens(formatReopens(result.nextOpen));
          setGoogleHours(parseGoogleHours(data.regularHours));
        })
        .catch(() => {
          const fb = getFallbackStatus();
          setStatus(fb.status);
          setMessage(formatMessage(fb.status, fb.closingMinutes, fb.nextOpen, false));
          setReopens(formatReopens(fb.nextOpen));
        });
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [ts.open, ts.closed, ts.closedHoliday, ts.closingSoon, ts.opensAt, ts.opensTomorrow, ts.opensDay]);

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

  const formatDay = (hours: string): string => {
    if (hours === "Fermé" || !hours) return ts.closedShort;
    return hours.replace(" – ", "–").replace(" – ", "–");
  };

  const badge = (
    <>
      {showIcon && <span className={`w-2 h-2 rounded-full ${c.dot} ${status !== "closed" ? "animate-pulse" : ""}`} />}
      <span className={`text-xs font-semibold ${c.text}`}>{message}</span>
      {reopens && status === "closed" && (
        <span className="text-[10px] text-gray-500 hidden sm:inline">({reopens})</span>
      )}
      <ChevronDown className={`w-3 h-3 ${c.text} transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </>
  );

  const pulseClass = status !== "closed" ? "animate-pulse-glow" : "";

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
              <span className="text-white text-xs font-semibold uppercase tracking-wide">{ts.hoursTitle}</span>
            </div>
            <div className="p-3 space-y-0.5">
              {dayNames.map((label, i) => {
                const hours = googleHours?.[i] ?? "";
                const display = formatDay(hours);
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
                      {display}
                    </span>
                  </div>
                );
              })}
            </div>
            {isHolidayToday() && (
              <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 text-red-400 text-[10px] font-semibold text-center uppercase">
                {ts.holidayToday}
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
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.border} border ${c.text} cursor-pointer hover:brightness-110 transition-all ${pulseClass}`}
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
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${c.border} ${c.bg} cursor-pointer hover:brightness-110 transition-all ${pulseClass}`}
      >
        {badge}
      </button>
      {hoursDropdown}
    </div>
  );
}
