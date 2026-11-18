import type { Brand } from "./types.ts";

// A made-up dealer. If switching to it leaves any trace of London LHD Centre
// on a page, something is hard-coded that belongs in the brand.
export const demo: Brand = {
  id: "demo",
  name: "Northgate Motor House",
  domain: "www.example.com",
  logo: { top: "NORTHGATE", bottom: "MOTOR HOUSE" },
  colors: {
    light: {
      bg: "#f6f4f0", surface: "#ffffff", fg: "#221c16", muted: "#6b6258",
      line: "#e2ddd5", accent: "#8a4b2a", accentInk: "#ffffff", picked: "#f4e9e2",
    },
    dark: {
      bg: "#17130f", surface: "#221c17", fg: "#efe9e2", muted: "#a89e93",
      line: "#3a322a", accent: "#d99a74", accentInk: "#17130f", picked: "#3a2a20",
    },
  },
  fonts: {
    display: 'Georgia, "Times New Roman", serif',
    body: 'system-ui, "Segoe UI", sans-serif',
  },
  contact: {
    phones: [{ label: "Sales", display: "01632 960000", tel: "+441632960000" }],
    email: "hello@example.com",
    address: "1 Example Street, Northgate",
    hours: "Monday to Saturday, 10am–6pm",
  },
  features: {
    sellForm: false,
    carsWanted: false,
    soldGallery: false,
    legacyRedirects: false,
    blog: false,
  },
  copy: {
    carsTitle: "Cars in stock",
    carsIntro: "Every car we have in today, photographed in full.",
    carsEmpty: "Nothing in stock today. New cars arrive every week.",
  },
  cardPhoto: { fit: "cover", ratio: "4 / 3" },
};
