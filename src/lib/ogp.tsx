import fs from "fs";
import { createRequire } from "module";
import OGPImage from "@/components/ogp/OGPImage";
import satori from "satori";

const require = createRequire(import.meta.url);

const fontPath =
  require.resolve("@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-400-normal.woff");
const boldFontPath =
  require.resolve("@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-700-normal.woff");

const fontKrPath =
  require.resolve("@fontsource/noto-sans-kr/files/noto-sans-kr-korean-400-normal.woff");
const boldFontKrPath =
  require.resolve("@fontsource/noto-sans-kr/files/noto-sans-kr-korean-700-normal.woff");

const fontScPath =
  require.resolve("@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-400-normal.woff");
const boldFontScPath =
  require.resolve("@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-700-normal.woff");

const fontTcPath =
  require.resolve("@fontsource/noto-sans-tc/files/noto-sans-tc-chinese-traditional-400-normal.woff");
const boldFontTcPath =
  require.resolve("@fontsource/noto-sans-tc/files/noto-sans-tc-chinese-traditional-700-normal.woff");

const fontData = fs.readFileSync(fontPath);
const boldFontData = fs.readFileSync(boldFontPath);

const fontKrData = fs.readFileSync(fontKrPath);
const boldFontKrData = fs.readFileSync(boldFontKrPath);

const fontScData = fs.readFileSync(fontScPath);
const boldFontScData = fs.readFileSync(boldFontScPath);

const fontTcData = fs.readFileSync(fontTcPath);
const boldFontTcData = fs.readFileSync(boldFontTcPath);

export const generateOgpImage = async (
  title: string,
  locale: string,
  siteName: string = "AI Model Price Comparison",
) => {
  const { Resvg } = await import("@resvg/resvg-js");

  // Define fonts with their data
  const allFonts = [
    {
      name: "Noto Sans JP",
      data: fontData,
      weight: 400 as const,
    },
    {
      name: "Noto Sans JP",
      data: boldFontData,
      weight: 700 as const,
    },
    {
      name: "Noto Sans KR",
      data: fontKrData,
      weight: 400 as const,
    },
    {
      name: "Noto Sans KR",
      data: boldFontKrData,
      weight: 700 as const,
    },
    {
      name: "Noto Sans SC",
      data: fontScData,
      weight: 400 as const,
    },
    {
      name: "Noto Sans SC",
      data: boldFontScData,
      weight: 700 as const,
    },
    {
      name: "Noto Sans TC",
      data: fontTcData,
      weight: 400 as const,
    },
    {
      name: "Noto Sans TC",
      data: boldFontTcData,
      weight: 700 as const,
    },
  ];

  // Reorder fonts based on locale to prioritize correct glyphs
  const prioritizedFonts = [...allFonts].sort((a, b) => {
    const getPriority = (name: string) => {
      if (locale === "ja" && name === "Noto Sans JP") return 0;
      if (locale === "ko" && name === "Noto Sans KR") return 0;
      if (locale === "zh-cn" && name === "Noto Sans SC") return 0;
      if (locale === "zh-tw" && name === "Noto Sans TC") return 0;
      return 1;
    };
    return getPriority(a.name) - getPriority(b.name);
  });

  const svg = await satori(<OGPImage title={title} siteName={siteName} />, {
    width: 1200,
    height: 630,
    fonts: prioritizedFonts.map((f) => ({
      name: f.name,
      data: f.data,
      style: "normal",
      weight: f.weight,
    })),
  });

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return pngBuffer;
};
