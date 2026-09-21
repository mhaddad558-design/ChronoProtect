import type { Metadata } from "next";
import FindYourKit from "@/components/FindYourKit";
import { getKitProducts, startingPrice } from "@/lib/shopify/products";
import "@/components/find-your-kit.css";

export const metadata: Metadata = {
  title: "Find your kit",
  description:
    "Pick your watch from pictures, choose coverage and finish, and the right ChronoProtect+ kit goes into the cart.",
};

export default async function Page() {
  // Prices are fetched here rather than in the client, so the first screen can
  // say what a kit starts at without waiting on a round trip.
  const products = await getKitProducts();

  return (
    <FindYourKit
      from={{
        chronoshield: startingPrice(products.chronoshield),
        chronoguard: startingPrice(products.chronoguard),
      }}
    />
  );
}
