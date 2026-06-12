import { ImageResponse } from "next/og";

// iOS home-screen / Apple touch icon. Square (Apple applies its own rounded
// mask) with the brand initials on the emerald gradient.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        fontSize: 96,
        fontWeight: 700,
        letterSpacing: -6,
      }}
    >
      CM
    </div>,
    { ...size },
  );
}
