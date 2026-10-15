import type { Metadata } from "next";
import ShopAll from "@/components/ShopAll";

export const metadata: Metadata = {
  title: "Shop all kits",
  description:
    "Every ChronoProtect+ kit in one place: ChronoShield+ in each finish and bracelet, and ChronoGuard+ in each finish.",
};

export default function ShopPage() {
  return <ShopAll />;
}
