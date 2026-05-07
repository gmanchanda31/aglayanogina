/* eslint-disable jsx-a11y/alt-text */
import path from "node:path";
import fs from "node:fs/promises";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const COLOR = {
  paper: "#FAF7F2",
  ink: "#0F0E0D",
  clay: "#B5826A",
  mist: "#E8E2D8",
  stone: "#6B655E",
};

/** Read a TTF bundled at /public/fonts/<file>.ttf */
async function loadFont(file: string): Promise<ArrayBuffer> {
  const abs = path.join(process.cwd(), "public", "fonts", file);
  const buf = await fs.readFile(abs);
  // Return a fresh ArrayBuffer slice — Buffer's underlying buffer can include
  // unrelated bytes which ImageResponse rejects.
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

interface LandingOGProps {
  /** Section eyebrow text (label-caps) */
  eyebrow?: string;
  /** Page title — the visual focal point */
  title: string;
  /** Optional italic stand-first */
  lede?: string;
  /** Optional image path (under /public). When provided, used as right column. */
  imagePath?: string;
}

export async function landingOG({ eyebrow, title, lede, imagePath }: LandingOGProps) {
  const [vollkorn, vollkornItalic, inter] = await Promise.all([
    loadFont("Vollkorn-700.ttf"),
    loadFont("Vollkorn-400-italic.ttf"),
    loadFont("Inter-500.ttf"),
  ]);

  let imageDataUri: string | null = null;
  if (imagePath) {
    try {
      const abs = path.join(process.cwd(), "public", imagePath.replace(/^\//, ""));
      const buf = await fs.readFile(abs);
      const ext = path.extname(abs).toLowerCase();
      const mime =
        ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
      imageDataUri = `data:${mime};base64,${buf.toString("base64")}`;
    } catch {
      imageDataUri = null;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: COLOR.paper,
          fontFamily: "Inter",
        }}
      >
        {/* Left text column */}
        <div
          style={{
            flex: imageDataUri ? "0 0 58%" : "1 1 100%",
            padding: "72px 80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: "Inter",
              fontSize: 18,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: COLOR.ink,
            }}
          >
            Aglaya Nogina
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {eyebrow ? (
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 18,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: COLOR.stone,
                }}
              >
                {eyebrow}
              </div>
            ) : null}

            <div
              style={{
                fontFamily: "Vollkorn",
                fontWeight: 700,
                fontSize: imageDataUri ? 96 : 132,
                lineHeight: 1.02,
                letterSpacing: "-0.01em",
                color: COLOR.ink,
              }}
            >
              {title}
            </div>

            {lede ? (
              <div
                style={{
                  fontFamily: "Vollkorn",
                  fontStyle: "italic",
                  fontSize: 28,
                  lineHeight: 1.4,
                  color: COLOR.stone,
                  maxWidth: 640,
                }}
              >
                {lede}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 16,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: COLOR.stone,
              }}
            >
              aglayanogina.com
            </div>
            <div
              style={{
                width: 56,
                height: 1,
                backgroundColor: COLOR.clay,
              }}
            />
          </div>
        </div>

        {/* Right image column */}
        {imageDataUri ? (
          <div
            style={{
              flex: "0 0 42%",
              display: "flex",
              padding: "32px 32px 32px 0",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                border: `1px solid ${COLOR.mist}`,
                backgroundColor: COLOR.mist,
                overflow: "hidden",
              }}
            >
              <img
                src={imageDataUri}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Vollkorn", data: vollkorn, weight: 700, style: "normal" },
        { name: "Vollkorn", data: vollkornItalic, weight: 400, style: "italic" },
        { name: "Inter", data: inter, weight: 500, style: "normal" },
      ],
    },
  );
}

interface DetailOGProps {
  section: string;
  title: string;
  meta?: string;
  imagePath: string;
}

export async function detailOG({ section, title, meta, imagePath }: DetailOGProps) {
  const [vollkorn, vollkornItalic, inter] = await Promise.all([
    loadFont("Vollkorn-700.ttf"),
    loadFont("Vollkorn-400-italic.ttf"),
    loadFont("Inter-500.ttf"),
  ]);

  let imageDataUri: string | null = null;
  try {
    const abs = path.join(process.cwd(), "public", imagePath.replace(/^\//, ""));
    const buf = await fs.readFile(abs);
    const ext = path.extname(abs).toLowerCase();
    const mime =
      ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
    imageDataUri = `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    imageDataUri = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: COLOR.paper,
          fontFamily: "Inter",
        }}
      >
        {/* Left image (full bleed) */}
        <div
          style={{
            flex: "0 0 50%",
            display: "flex",
            backgroundColor: COLOR.mist,
            overflow: "hidden",
          }}
        >
          {imageDataUri ? (
            <img
              src={imageDataUri}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
        </div>

        {/* Right text column */}
        <div
          style={{
            flex: "0 0 50%",
            padding: "72px 64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: "Inter",
              fontSize: 18,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: COLOR.ink,
            }}
          >
            Aglaya Nogina
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 18,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: COLOR.clay,
              }}
            >
              {section}
            </div>

            <div
              style={{
                fontFamily: "Vollkorn",
                fontWeight: 700,
                fontSize: title.length > 22 ? 76 : 96,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: COLOR.ink,
              }}
            >
              {title}
            </div>

            {meta ? (
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 18,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: COLOR.stone,
                  lineHeight: 1.5,
                }}
              >
                {meta}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ width: 56, height: 1, backgroundColor: COLOR.clay }} />
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 14,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: COLOR.stone,
              }}
            >
              aglayanogina.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Vollkorn", data: vollkorn, weight: 700, style: "normal" },
        { name: "Vollkorn", data: vollkornItalic, weight: 400, style: "italic" },
        { name: "Inter", data: inter, weight: 500, style: "normal" },
      ],
    },
  );
}
