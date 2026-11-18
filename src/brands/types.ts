// Everything that makes a site one dealer rather than another. Pages read the
// brand; nothing about London LHD Centre (or "left hand drive") lives in code.

/** One colour set; every value becomes a CSS variable (--color-<key>). */
export interface Palette {
  bg: string;
  surface: string;
  fg: string;
  muted: string;
  line: string;
  accent: string;
  accentInk: string;
  picked: string;
}

export interface Phone {
  label: string;
  /** As shown: "07801 110000". */
  display: string;
  /** For tel: links: "+447801110000". */
  tel: string;
}

export interface Brand {
  /** Folder-safe id; picks this brand via the BRAND env var. */
  id: string;
  name: string;
  domain: string;
  /** Wordmark: a first line and a second smaller line (logo concept E). */
  logo: { top: string; bottom: string };
  colors: { light: Palette; dark: Palette };
  /** Font family stacks; the font files themselves load in the layout. */
  fonts: { display: string; body: string };
  contact: {
    phones: Phone[];
    email: string;
    address: string;
    hours: string;
    viewings?: string;
    googleProfileUrl?: string;
  };
  features: {
    sellForm: boolean;
    carsWanted: boolean;
    soldGallery: boolean;
    legacyRedirects: boolean;
    blog: boolean;
  };
  /** Per-brand copy. Only facts the client has confirmed. */
  copy: {
    carsTitle: string;
    carsIntro: string;
    /** /cars with no stock. */
    carsEmpty: string;
  };
  /**
   * How car photos sit in the /cars grid frame. "contain" shows the whole
   * photo (bands at the sides if it doesn't fit); "cover" fills the frame and
   * trims the edges. Photos are never cropped on disk, so this can change any
   * time.
   */
  cardPhoto: { fit: "contain" | "cover"; ratio: string };
}
