// /cars quick look: a native <dialog> (focus trap, Esc, top layer for free)
// filled from /api/cars/<slug>.json. Plain clicks on a card photo open it;
// ctrl/cmd/shift/middle clicks still follow the link to the car page.

interface QuickCar {
  slug: string;
  make: string;
  model: string;
  specs: string;
  price: string;
  description: string;
  photos: { avif: string; jpg: string; src: string; w: number; h: number; placeholder: string }[];
}

const dlg = document.querySelector<HTMLDialogElement>("#quick");
const cache = new Map<string, Promise<QuickCar>>();

const load = (slug: string) => {
  let p = cache.get(slug);
  if (!p) {
    p = fetch(`/api/cars/${encodeURIComponent(slug)}.json`).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<QuickCar>;
    });
    p.catch(() => cache.delete(slug));
    cache.set(slug, p);
  }
  return p;
};

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

function fill(c: QuickCar) {
  if (!dlg) return;
  const $ = (s: string) => dlg.querySelector<HTMLElement>(s)!;
  $(".q-make").textContent = c.make;
  $(".q-model").textContent = c.model;
  $(".q-specs").textContent = c.specs;
  $(".q-price").textContent = c.price;
  $(".q-desc").textContent = c.description;
  $(".q-view").setAttribute("href", `/cars/${c.slug}`);
  $(".q-note").textContent = c.photos.length > 1 ? `${c.photos.length} photos. Scroll sideways for more.` : "";
  const strip = $(".q-strip");
  strip.replaceChildren(
    ...c.photos.map((p, i) => {
      const pic = el("picture");
      const s = el("source");
      s.type = "image/avif";
      s.srcset = p.avif;
      s.sizes = "(min-width: 980px) 540px, 86vw";
      const img = el("img");
      img.src = p.src;
      img.srcset = p.jpg;
      img.sizes = s.sizes;
      img.width = p.w;
      img.height = p.h;
      img.alt = `${c.make} ${c.model}, photo ${i + 1} of ${c.photos.length}`;
      img.decoding = "async";
      if (i > 2) img.loading = "lazy";
      img.style.backgroundImage = `url(${p.placeholder})`;
      pic.append(s, img);
      return pic;
    }),
  );
  strip.scrollLeft = 0;
}

if (dlg) {
  document.addEventListener("click", async (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>("a[data-quick]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    try {
      fill(await load(a.dataset.quick!));
      dlg.showModal();
    } catch {
      location.href = a.href; // couldn't load: just go to the car
    }
  });
  // Warm the data on hover/focus so the dialog opens instantly.
  const warm = (e: Event) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>("a[data-quick]");
    if (a) load(a.dataset.quick!).catch(() => {});
  };
  document.addEventListener("pointerover", warm, { passive: true });
  document.addEventListener("focusin", warm);
  dlg.querySelector(".q-close")?.addEventListener("click", () => dlg.close());
  // A click on the backdrop (outside the panel) closes it.
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
}
