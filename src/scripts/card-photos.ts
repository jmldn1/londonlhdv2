// The photos on a car card (src/components/CarCard.astro), as on v1: a row
// swiped with the phone's own scrolling, and each photo
// loaded only when it's about to be reached. Later photos wait in a
// <template>, which browsers don't fetch from (loading="lazy" can't be relied
// on inside a sideways row). One script for every card on the page.

/** Puts a waiting photo into its slide; nothing if it's already there. */
function show(slide: Element | undefined) {
  const t = slide?.querySelector("template");
  if (t) t.replaceWith(t.content);
}

// A card that stays on screen for a moment is likely to be swiped: its second
// photo loads then, but never before the page itself has finished loading.
// Cards scrolled straight past cost nothing.
const DWELL_MS = 900;
const timers = new WeakMap<Element, number>();
const dwell = new IntersectionObserver(
  (entries) => {
    for (const { target, isIntersecting } of entries) {
      clearTimeout(timers.get(target));
      if (!isIntersecting) continue;
      timers.set(
        target,
        window.setTimeout(() => {
          show(target.querySelectorAll(".slide")[1]);
          dwell.unobserve(target);
        }, DWELL_MS),
      );
    }
  },
  { threshold: 0.6 },
);

function setUp(box: HTMLElement) {
  const track = box.querySelector<HTMLElement>(".track");
  const slides = [...box.querySelectorAll(".slide")];
  if (!track || slides.length < 2) return;
  const place = () => track.scrollLeft / track.clientWidth;
  const at = () => Math.round(place());

  // The photo at i, and the one after: usually ready by the time it's reached.
  const load = (i: number) => {
    show(slides[i]);
    show(slides[i + 1]);
  };
  // A finger on the photos, or a mouse over them: the next one is likely.
  box.addEventListener("pointerdown", () => load(at()), { passive: true });
  box.addEventListener("pointerenter", () => load(at()), { passive: true });
  // As soon as the row moves, load the photo it's heading for.
  track.addEventListener(
    "scroll",
    () => {
      load(Math.floor(place()));
      show(slides[Math.ceil(place()) + 1]);
    },
    { passive: true },
  );
  if (document.readyState === "complete") dwell.observe(box);
  else addEventListener("load", () => dwell.observe(box), { once: true });
}

document.querySelectorAll<HTMLElement>("[data-card-photos]").forEach(setUp);
