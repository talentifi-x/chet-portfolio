import { ImageResponse } from "next/og";

// Browser-tab favicon, generated from the brand initials "CM" on the same
// emerald gradient as the site's logo mark. Next.js wires the <link> tags up
// automatically from this file.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #4ECCA3 0%, #0B5844 72%)",
        color: "#ffffff",
        fontSize: 34,
        fontWeight: 700,
        letterSpacing: -2,
        borderRadius: "50%",
      }}
    >
      CM
    </div>,
    { ...size },
  );
}
