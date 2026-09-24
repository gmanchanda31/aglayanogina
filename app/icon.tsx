/* eslint-disable jsx-a11y/alt-text */
import path from "node:path";
import fs from "node:fs/promises";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const fontPath = path.join(process.cwd(), "public", "fonts", "Inter-Medium.ttf");
  const buf = await fs.readFile(fontPath);
  const fontData = buf.buffer.slice(
    buf.byteOffset,
    buf.byteOffset + buf.byteLength,
  ) as ArrayBuffer;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F0E0D",
          color: "#FAF7F2",
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: 36,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        AN
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: fontData, weight: 500, style: "normal" }],
    },
  );
}
