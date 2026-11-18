// What the /cars quick look needs for one car, fetched when it opens (or on
// hover, just before), so the /cars page itself stays small.
import type { APIRoute } from "astro";
import { getCar, specsLine, priceLabel } from "../../../lib/cars.ts";
import { srcset, pick } from "../../../lib/photos.ts";

export const GET: APIRoute = async ({ params }) => {
  const car = await getCar(params.slug ?? "");
  if (!car) return new Response("Not found", { status: 404 });
  const body = {
    slug: car.slug,
    make: car.make,
    model: car.model,
    specs: specsLine(car),
    price: priceLabel(car),
    description: car.description,
    photos: car.photos.map((p) => ({
      avif: srcset(p.avif),
      jpg: srcset(p.jpg),
      src: pick(p.jpg, 800).url,
      w: p.width,
      h: p.height,
      placeholder: p.placeholder,
    })),
  };
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json", "cache-control": "public, max-age=60" },
  });
};
