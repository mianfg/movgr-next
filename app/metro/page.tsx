import { DireccionMetro } from "@/interfaces/metro";
import { getParadasMetro } from "@/lib/metro";
import { MainContent } from "../components/MainContent";


export default async function MetroPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {
  const idParada = (await searchParams).id;
  const direccion = (await searchParams).sentido === "Albolote" ? DireccionMetro.Albolote : DireccionMetro.Armilla;
  const paradas = await getParadasMetro();
  const selectedParada = paradas.find(p => p.id === idParada) || undefined;

  return <MainContent
    defaultTab="metro"
    initialParadaMetro={selectedParada}
    initialDireccionMetro={direccion}
  />;
}
