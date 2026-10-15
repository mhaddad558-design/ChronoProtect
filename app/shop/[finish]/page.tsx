import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShopAll, { finishFromSlug, finishSlug } from "@/components/ShopAll";
import { FINISHES } from "@/lib/site";

// Only /shop/gloss and /shop/stealth exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return FINISHES.map((f) => ({ finish: finishSlug(f.name) }));
}

type Props = { params: Promise<{ finish: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const finish = finishFromSlug((await params).finish);
  if (!finish) return {};
  return {
    title: `${finish} kits`,
    description: `Every ChronoProtect+ kit in the ${finish} finish: ChronoShield+ in each bracelet, and ChronoGuard+.`,
  };
}

export default async function ShopFinishPage({ params }: Props) {
  const finish = finishFromSlug((await params).finish);
  if (!finish) notFound();
  return <ShopAll finish={finish} />;
}
