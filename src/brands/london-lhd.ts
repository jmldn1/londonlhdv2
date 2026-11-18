import type { Brand } from "./types.ts";

// Facts copied from v1 (index.js siteContact, Oct 2026), all client-confirmed.
export const londonLhd: Brand = {
  id: "london-lhd",
  name: "London LHD Centre",
  domain: "www.londonlhdcentre.com",
  logo: { top: "LONDON", bottom: "LEFT HAND DRIVE CENTRE" },
  colors: {
    light: {
      bg: "#f3f5f8", surface: "#ffffff", fg: "#142033", muted: "#5b6676",
      line: "#d9dee6", accent: "#3d6f9e", accentInk: "#ffffff", picked: "#e8f0f8",
    },
    dark: {
      bg: "#0e1520", surface: "#172131", fg: "#e6ebf2", muted: "#9aa6b6",
      line: "#2a3648", accent: "#7aa9d6", accentInk: "#0e1520", picked: "#1d3047",
    },
  },
  fonts: {
    // Font files and preloads: src/brands/fonts/london-lhd.ts
    display: '"Barlow Condensed", "Arial Narrow", Arial, sans-serif',
    body: '"Source Sans 3", "Segoe UI", system-ui, sans-serif',
  },
  contact: {
    phones: [
      { label: "Sales", display: "07801 110000", tel: "+447801110000" },
      { label: "Office", display: "020 7371 9120", tel: "+442073719120" },
    ],
    email: "sales@londonlhdcentre.com",
    address: "Chelsea Harbour, London SW10 0XG",
    hours: "Open every day, 9am–5pm",
    viewings: "Viewings by appointment",
    googleProfileUrl: "https://g.page/r/CVuxco-vL46KEBM",
  },
  features: {
    sellForm: true,
    carsWanted: true,
    soldGallery: true,
    legacyRedirects: true,
    blog: true,
  },
  copy: {
    carsTitle: "Left hand drive cars for sale",
    // v1's /cars page description (views/cars.ejs).
    carsIntro: "Hand-picked left hand drive cars, photographed in detail, with UK or foreign registration explained for every car.",
    // v1's /cars closing band wording (views/cars.ejs).
    carsEmpty: "Our stock changes regularly. Call 07801 110000 or tell us what you're looking for and we'll let you know when one comes in.",
  },
  cardPhoto: { fit: "contain", ratio: "3 / 2" },
};
