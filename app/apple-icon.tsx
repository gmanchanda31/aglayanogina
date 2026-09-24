/* eslint-disable jsx-a11y/alt-text */
import path from "node:path";
import fs from "node:fs/promises";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fontPath = path.join(process.cwd(), "public", "fonts", "arimo-latin-400.woff");
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
          fontFamily: "Arimo",
          fontWeight: 400,
          fontSize: 88,
          lineHeight: 1,
        }}
      >
        AN
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Arimo", data: fontData, weight: 400, style: "normal" }],
    },
  );
}
