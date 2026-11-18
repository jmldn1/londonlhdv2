// Stock. For now it's read from a JSON file made by the import script; the
// MongoDB version (v2's own database, never the live one) will keep these
// same functions so pages don't change.
import fs from "node:fs/promises";
import path from "node:path";
import type { Photo } from "./photos.ts";

export interface Car {
  id: string;
  slug: string;
  make: string;
  model: string;
  year?: string;
  mileage?: string;
  colour?: string;
  registered?: string;
  /** Pounds; null shows as POA. */
  price: number | null;
  description: string;
  status: "available" | "reserved" | "sold";
  photos: Photo[];
}

const dataFile = () => path.join(process.env.DATA_DIR || path.resolve("data"), "cars.json");

let cache: { mtime: number; cars: Car[] } | null = null;

export async function listCars(): Promise<Car[]> {
  const file = dataFile();
  const stat = await fs.stat(file).catch(() => null);
  if (!stat) return [];
  if (cache?.mtime !== stat.mtimeMs) {
    cache = { mtime: stat.mtimeMs, cars: JSON.parse(await fs.readFile(file, "utf8")) };
  }
  return cache.cars;
}

export async function getCar(slug: string): Promise<Car | undefined> {
  return (await listCars()).find((c) => c.slug === slug);
}

/** "2018 · 51,700 miles · Silver · reg. Czech Republic" */
export function specsLine(c: Car): string {
  const nice = (s: string) =>
    s.length <= 3 ? s.toUpperCase() : s.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());
  return [c.year, c.mileage, c.colour && nice(c.colour), c.registered && `reg. ${nice(c.registered)}`]
    .filter(Boolean)
    .join(" · ");
}

export const priceLabel = (c: Car) =>
  c.price ? `£${c.price.toLocaleString("en-GB")}` : "POA";
