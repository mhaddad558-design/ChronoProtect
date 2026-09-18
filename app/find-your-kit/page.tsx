import type { Metadata } from "next";
import FindYourKit from "@/components/FindYourKit";
import "@/components/find-your-kit.css";

export const metadata: Metadata = {
  title: "Find your kit",
  description:
    "Five questions — reference, wear pattern, finish, coverage, and application — and the right ChronoProtect+ kit goes into the cart.",
};

export default function Page() {
  return <FindYourKit />;
}
