import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const alt = SITE_NAME;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
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
          backgroundColor: "#f4f3ee",
          color: "#181716",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 9999,
            backgroundColor: "#1c1917",
            color: "#fbbf24",
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          P
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 1.05,
            marginTop: 36,
          }}
        >
          The Personal
          <br />
          <span style={{ color: "#d97706" }}>Curation</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#57534e",
            marginTop: 28,
            textAlign: "center",
            maxWidth: 720,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size }
  );
}
