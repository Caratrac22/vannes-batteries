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
          background: "linear-gradient(135deg, #0B132B 0%, #1E3A8A 50%, #1E40AF 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-60px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Battery icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
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
            }}
          >
            <div
              style={{
                width: "70%",
                height: "100%",
                background: "linear-gradient(90deg, #DC2626, #EF4444)",
                borderRadius: "2px",
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
              letterSpacing: "-1px",
              color: "white",
              textShadow: "0 4px 30px rgba(0,0,0,0.4)",
              lineHeight: "1",
            }}
          >
            VANNES BATTERIES
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "600",
              fontFamily: "sans-serif",
              color: "rgba(255,255,255,0.7)",
              marginTop: "16px",
              letterSpacing: "6px",
              textTransform: "uppercase",
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
              color: "rgba(255,255,255,0.6)",
            }}
          >
            +300 modèles en stock
          </div>
          <div
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "rgba(220,38,38,0.8)",
            }}
          />
          <div
            style={{
              fontSize: "18px",
              fontFamily: "sans-serif",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Pose en magasin
          </div>
          <div
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "rgba(220,38,38,0.8)",
            }}
          />
          <div
            style={{
              fontSize: "18px",
              fontFamily: "sans-serif",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            02 97 49 20 19
          </div>
        </div>

        {/* Red accent line */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "linear-gradient(90deg, #DC2626, #EF4444, #DC2626)",
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
