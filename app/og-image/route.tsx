import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B132B 0%, #0D1B3E 40%, #112247 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow behind text */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(0,210,255,0.10) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "80px",
              fontWeight: "800",
              fontFamily: "sans-serif",
              fontStyle: "italic",
              letterSpacing: "3px",
              color: "white",
              textShadow: "0 0 10px rgba(0,210,255,0.7), 0 0 30px rgba(0,210,255,0.4), 0 0 60px rgba(0,210,255,0.15)",
              lineHeight: "1",
            }}
          >
            VANNES BATTERIES
          </div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: "600",
              fontFamily: "sans-serif",
              color: "rgba(0,210,255,0.8)",
              marginTop: "20px",
              letterSpacing: "8px",
              textTransform: "uppercase",
              textShadow: "0 0 12px rgba(0,210,255,0.3)",
            }}
          >
            Spécialiste Batterie à Vannes
          </div>
        </div>

        {/* Bottom info */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "32px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontFamily: "sans-serif",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            +300 modèles en stock
          </div>
          <div
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "rgba(0,210,255,0.5)",
            }}
          />
          <div
            style={{
              fontSize: "18px",
              fontFamily: "sans-serif",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Pose en magasin
          </div>
          <div
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "rgba(0,210,255,0.5)",
            }}
          />
          <div
            style={{
              fontSize: "18px",
              fontFamily: "sans-serif",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            02 97 49 20 19
          </div>
        </div>

        {/* Neon blue bottom line */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "3px",
            background: "linear-gradient(90deg, transparent, #00D2FF, transparent)",
            boxShadow: "0 0 12px rgba(0,210,255,0.4)",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
