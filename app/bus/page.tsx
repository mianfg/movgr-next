import { getParadaBus } from "@/lib/bus";
import { MainContent } from "../components/MainContent";

export default async function BusPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const idParadaFromSearchParams = (await searchParams).id;
  const idParada = idParadaFromSearchParams
    ? Array.isArray(idParadaFromSearchParams)
      ? parseInt(idParadaFromSearchParams[0])
      : parseInt(idParadaFromSearchParams)
    : null;
  const selectedParada = idParada ? await getParadaBus(idParada) || undefined : undefined;

  return <MainContent
    defaultTab="bus"
    initialParadaBus={selectedParada}
  />;
}