"use client";

import dynamic from "next/dynamic";

const TransportMap = dynamic(
  () => import("@/components/map/TransportMap").then((mod) => mod.TransportMap),
  { ssr: false }
);

export default function MapPage() {
  return <TransportMap />;
}
