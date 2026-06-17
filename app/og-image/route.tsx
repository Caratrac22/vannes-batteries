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
        {/* Glow circle behind text */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(0,210,255,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,210,255,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-140px",
            left: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,210,255,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Battery icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "28px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "64px",
              height: "32px",
              border: "4px solid rgba(255,255,255,0.9)",
              borderRadius: "6px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              padding: "4px",
              boxShadow: "0 0 16px rgba(0,210,255,0.4)",
            }}
          >
            <div
              style={{
                width: "70%",
                height: "100%",
                background: "linear-gradient(90deg, #00D2FF, #38bdf8)",
                borderRadius: "2px",
                boxShadow: "0 0 10px rgba(0,210,255,0.6)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "-10px",
                width: "8px",
                height: "16px",
                background: "rgba(255,255,255,0.9)",
                borderRadius: "0 3px 3px 0",
              }}
            />
          </div>
        </div>

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
              fontSize: "72px",
              fontWeight: "800",
              fontFamily: "sans-serif",
              fontStyle: "italic",
              letterSpacing: "2px",
              color: "white",
              textShadow: "0 0 8px rgba(0,210,255,0.7), 0 0 20px rgba(0,210,255,0.4), 0 0 40px rgba(0,210,255,0.15)",
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
              marginTop: "18px",
              letterSpacing: "8px",
              textTransform: "uppercase",
              textShadow: "0 0 10px rgba(0,210,255,0.3)",
            }}
          >
            Spécialiste Batterie à Vannes
          </div>
        </div>

        {/* Bottom bar */}
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
              background: "rgba(0,210,255,0.6)",
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
              background: "rgba(0,210,255,0.6)",
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

        {/* Neon blue accent line */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "linear-gradient(90deg, transparent, #00D2FF, transparent)",
            boxShadow: "0 0 12px rgba(0,210,255,0.5)",
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
