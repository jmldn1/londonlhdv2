// Car photo pipeline. Photos are never cropped on disk: each upload is kept
// whole, fitted inside MAX_EDGE, and encoded at a few widths. Any framing
// (a grid card's fixed shape) happens on the page in CSS, so it can change
// later without reprocessing a single photo.
//
// Carried over from v1's utils/imageService.js: decode once to a raw bitmap,
// encode one variant at a time (memory on a small VPS), cache off.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

sharp.cache(false);

/** Longest edge kept. Big enough for a full-screen view on a 1440p screen. */
const MAX_EDGE = 2048;
/** Widths to make (those wider than the photo are skipped). */
const WIDTHS = [480, 800, 1200, 1600, 2048];
/** JPG is only the fallback for the few browsers without AVIF. */
const JPG_WIDTHS = [800, 1600];
// Encoding runs after the upload request returns (or in the import script),
// so AVIF can afford a higher effort than v1's in-request effort 2.
const AVIF = { quality: 50, effort: 4 };
const JPG = { quality: 78, mozjpeg: true };

export interface PhotoVariant {
  w: number;
  h: number;
  url: string;
}

export interface Photo {
  id: string;
  /** Size of the largest variant: gives the photo's true shape to the page. */
  width: number;
  height: number;
  /** Tiny blurred preview (data: URL) shown while the photo loads. */
  placeholder: string;
  avif: PhotoVariant[];
  jpg: PhotoVariant[];
}

export interface PhotoStore {
  /** Folder the files are written to. */
  dir: string;
  /** URL the same folder is served from. */
  urlBase: string;
}

export const photoStore = (): PhotoStore => ({
  dir: process.env.PHOTO_DIR || path.resolve("public/photos"),
  urlBase: process.env.PHOTO_URL || "/photos",
});

/**
 * Encodes one photo into `<store.dir>/<folder>/<id>-<w>.<ext>` and returns
 * its record. Existing files are reused, so re-running is cheap.
 */
export async function processPhoto(
  input: string | Buffer,
  store: PhotoStore,
  folder: string,
  id: string,
): Promise<Photo> {
  const outDir = path.join(store.dir, folder);
  await fs.mkdir(outDir, { recursive: true });

  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const raw = { raw: { width: info.width, height: info.height, channels: info.channels } };
  const scaleH = (w: number) => Math.round((info.height * w) / info.width);

  // Widths up to the photo's own width, always including that width itself.
  const widths = [...new Set([...WIDTHS.filter((w) => w < info.width), info.width])];
  const jpgWidths = [...new Set(JPG_WIDTHS.map((w) => Math.min(w, info.width)))];

  const encode = async (w: number, ext: "avif" | "jpg"): Promise<PhotoVariant> => {
    const name = `${id}-${w}.${ext}`;
    const file = path.join(outDir, name);
    const exists = await fs.stat(file).then(() => true, () => false);
    if (!exists) {
      const img = sharp(data, raw).resize({ width: w });
      await (ext === "avif" ? img.avif(AVIF) : img.jpeg(JPG)).toFile(file);
    }
    return { w, h: scaleH(w), url: `${store.urlBase}/${folder}/${name}` };
  };

  // One at a time on purpose (see the header).
  const avif: PhotoVariant[] = [];
  for (const w of widths) avif.push(await encode(w, "avif"));
  const jpg: PhotoVariant[] = [];
  for (const w of jpgWidths) jpg.push(await encode(w, "jpg"));

  const tiny = await sharp(data, raw).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();

  return {
    id,
    width: info.width,
    height: info.height,
    placeholder: `data:image/webp;base64,${tiny.toString("base64")}`,
    avif,
    jpg,
  };
}

export const srcset = (variants: PhotoVariant[]) => variants.map((v) => `${v.url} ${v.w}w`).join(", ");

/** The variant closest to (but not under) a width; the largest if none is. */
export const pick = (variants: PhotoVariant[], w: number) =>
  variants.find((v) => v.w >= w) ?? variants[variants.length - 1];
