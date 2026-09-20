"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const TransportMap = dynamic(
  () => import("@/components/map/TransportMap").then((mod) => mod.TransportMap),
  { ssr: false }
);

export default function MapPage() {
  return (
    <Suspense>
      <TransportMap />
    </Suspense>
  );
}
