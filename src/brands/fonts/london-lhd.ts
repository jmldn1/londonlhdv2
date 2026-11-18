// London LHD Centre's fonts: the @font-face rules, and the files the top of
// a page needs straight away (headings, model names, body text), preloaded so
// text doesn't swap fonts and shift the layout after it first paints.
import "./london-lhd.css";
import barlow700 from "@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2?url";
import barlow600 from "@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2?url";
import sans400 from "@fontsource/source-sans-3/files/source-sans-3-latin-400-normal.woff2?url";

export const preload: string[] = [barlow700, barlow600, sans400];
