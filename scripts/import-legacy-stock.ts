// Fills v2 with test stock from the old site's downloaded sold cars, so pages
// can be built against real photos before v2 has its own database.
//
//   node scripts/import-legacy-stock.ts <legacy-sold folder> [count=20] [photos per car=10]
//
// Writes data/cars.json and public/photos/ (both git-ignored). Run it again
// to pick up changes; photos already encoded are reused.
import fs from "node:fs/promises";
import path from "node:path";
import { processPhoto, photoStore, type Photo } from "../src/lib/photos.ts";
import type { Car } from "../src/lib/cars.ts";

const [src, countArg, perCarArg] = process.argv.slice(2);
if (!src) {
  console.error("usage: node scripts/import-legacy-stock.ts <legacy-sold folder> [count] [photos per car]");
  process.exit(1);
}
const COUNT = Number(countArg) || 20;
const PER_CAR = Number(perCarArg) || 10;

interface Legacy {
  folder: string;
  make: string;
  title: string;
  description: string;
  specs: { year?: string; mileage?: string; colour?: string; registered?: string };
}

const MAKES: Record<string, string> = {
  bmw: "BMW", mini: "MINI", mclaren: "McLaren", "mercedes-benz": "Mercedes-Benz",
  "rolls-royce": "Rolls-Royce", "land-rover": "Land Rover", "aston-martin": "Aston Martin", seat: "SEAT",
};
const makeName = (slug: string) =>
  MAKES[slug] ?? slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const index: Legacy[] = JSON.parse(await fs.readFile(path.join(src, "index.json"), "utf8"));

// Spread the picks across the list so the test stock has a mix of makes.
const withPhotos: Legacy[] = [];
for (const c of index) {
  const dir = path.join(src, c.folder, "photos");
  if ((await fs.readdir(dir).catch(() => [])).length) withPhotos.push(c);
}
const step = Math.max(1, Math.floor(withPhotos.length / COUNT));
const chosen = withPhotos.filter((_, i) => i % step === 0).slice(0, COUNT);

const store = photoStore();
const cars: Car[] = [];
const seen = new Set<string>();

for (const [i, c] of chosen.entries()) {
  const make = makeName(c.make);
  // Old titles start with the make and often end with the year: drop both.
  const words = make.replace("-", " ").split(" ").length;
  let model = c.title.split(" ").slice(words).join(" ").replace(/\s+0$/, "").trim();
  const year = c.specs.year && c.specs.year !== "0" ? c.specs.year : undefined;
  if (year && model.endsWith(" " + year)) model = model.slice(0, -(year.length + 1));

  let slug = slugify(`${make} ${model}`);
  while (seen.has(slug)) slug += "-2";
  seen.add(slug);

  const dir = path.join(src, c.folder, "photos");
  const files = (await fs.readdir(dir)).filter((f) => /\.jpe?g$/i.test(f)).sort().slice(0, PER_CAR);
  const id = `t${String(i + 1).padStart(3, "0")}`;
  const photos: Photo[] = [];
  for (const [j, f] of files.entries()) {
    photos.push(await processPhoto(path.join(dir, f), store, id, String(j + 1).padStart(2, "0")));
  }

  cars.push({
    id,
    slug,
    make,
    model,
    year,
    mileage: c.specs.mileage?.replace(/^(\d+)(\d{3}) miles$/, "$1,$2 miles"),
    colour: c.specs.colour,
    registered: c.specs.registered,
    price: null,
    description: c.description.replace(/^\s*(NOW\s+)?SOLD[.\s…]*/i, "").trim(),
    status: "available",
    photos,
  });
  console.log(`${i + 1}/${chosen.length} ${make} ${model} (${photos.length} photos)`);
}

const dataDir = process.env.DATA_DIR || path.resolve("data");
await fs.mkdir(dataDir, { recursive: true });
await fs.writeFile(path.join(dataDir, "cars.json"), JSON.stringify(cars, null, 2));
console.log(`Wrote ${cars.length} cars to ${path.join(dataDir, "cars.json")}`);
