import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  const rajdhaniBold = await fetch(
    "https://raw.githubusercontent.com/google/fonts/main/ofl/rajdhani/Rajdhani-Bold.ttf"
  ).then((r) => r.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0B132B 0%, #1E40AF 45%, #0B132B 100%)",
          fontFamily: `Inter, "Noto Sans", system-ui, sans-serif`,
        }}
      >
        {/* Glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-60px",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background: "rgba(220, 38, 38, 0.18)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-80px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "rgba(30, 64, 175, 0.20)",
            filter: "blur(90px)",
          }}
        />

        {/* Decorative lightning bolt */}
        <svg
          width="80"
          height="120"
          viewBox="0 0 80 120"
          fill="none"
          style={{ position: "absolute", top: "30px", left: "55px", opacity: 0.12 }}
        >
          <path
            d="M45 5L10 65h25L20 115l50-70H45l5-40z"
            fill="#DC2626"
          />
        </svg>

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #DC2626, #1E40AF)",
          }}
        />

        {/* Main title */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "14px",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              fontSize: "90px",
              fontWeight: 700,
              color: "#60A5FA",
              fontFamily: "Rajdhani",
              letterSpacing: "6px",
              textShadow: "0 0 40px rgba(96,165,250,0.3)",
              lineHeight: 1,
            }}
          >
            VANNES
          </span>
          <span
            style={{
              fontSize: "90px",
              fontWeight: 700,
              color: "#EF4444",
              fontFamily: "Rajdhani",
              letterSpacing: "6px",
              textShadow: "0 0 40px rgba(239,68,68,0.3)",
              lineHeight: 1,
            }}
          >
            BATTERIES
          </span>
        </div>

        {/* Separator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #DC2626)",
            }}
          />
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#DC2626",
              boxShadow: "0 0 20px rgba(220,38,38,0.5)",
            }}
          />
          <div
            style={{
              width: "60px",
              height: "2px",
              background: "linear-gradient(90deg, #DC2626, transparent)",
            }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "22px",
            fontWeight: 600,
            color: "#94A3B8",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          PROFESSIONNEL DE LA BATTERIE
        </div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 400,
            color: "#64748B",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "36px",
          }}
        >
          Depuis plus de 30 ans — Vannes
        </div>

        {/* Contact strip */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            padding: "16px 32px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <span style={{ fontSize: "16px", color: "#CBD5E1", letterSpacing: "0.5px" }}>
            📍 Z.A. de Kerniol — 56000 Vannes
          </span>
          <span style={{ fontSize: "16px", color: "#CBD5E1", letterSpacing: "0.5px" }}>
            📞 02 97 49 20 19
          </span>
        </div>

        {/* URL */}
        <div
          style={{
            fontSize: "14px",
            fontWeight: 400,
            color: "#475569",
            letterSpacing: "2px",
            marginTop: "28px",
            textTransform: "uppercase",
          }}
        >
          www.vannes-batteries.fr
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Rajdhani",
          data: rajdhaniBold,
          weight: 700,
          style: "normal",
        },
      ],
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
