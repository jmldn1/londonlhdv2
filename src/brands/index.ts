import type { Brand, Palette } from "./types.ts";
import { londonLhd } from "./london-lhd.ts";
import { demo } from "./demo.ts";

const BRANDS: Record<string, Brand> = { [londonLhd.id]: londonLhd, [demo.id]: demo };

const wanted = process.env.BRAND || londonLhd.id;
const found = BRANDS[wanted];
if (!found) throw new Error(`Unknown BRAND "${wanted}". Known: ${Object.keys(BRANDS).join(", ")}`);

export const brand: Brand = found;
export type { Brand };

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
const vars = (p: Palette) =>
  Object.entries(p).map(([k, v]) => `--brand-${kebab(k)}:${v};`).join("");

/**
 * The brand's design tokens as CSS variables (--brand-*): light by default,
 * dark when the system asks (unless the page forces light), and
 * data-theme="dark" to force dark. src/styles/global.css maps them onto
 * Tailwind's theme, so pages never name a colour or font directly.
 */
export function brandCss(b: Brand = brand): string {
  const fonts = `--brand-font-display:${b.fonts.display};--brand-font-body:${b.fonts.body};--card-ratio:${b.cardPhoto.ratio};`;
  return (
    `:root{${vars(b.colors.light)}${fonts}}` +
    `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${vars(b.colors.dark)}color-scheme:dark}}` +
    `:root[data-theme="dark"]{${vars(b.colors.dark)}color-scheme:dark}`
  );
}
