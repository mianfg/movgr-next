import { LlegadasMetro, ParadaMetro } from "@/interfaces/metro";
import { LineaMetroDetail } from "@/interfaces/map";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function getLlegadasMetro(): Promise<LlegadasMetro[]> {
  const response = await fetch(`${API}/metro/llegadas`);
  return response.json();
}

export async function getLlegadasMetroParada(id: string): Promise<LlegadasMetro | null> {
  const response = await fetch(`${API}/metro/llegadas/${id}`);
  if (response.ok) {
    return response.json();
  }
  return null;
}

export async function getParadasMetro(): Promise<ParadaMetro[]> {
  const response = await fetch(`${API}/metro/paradas`);
  return response.json();
}

export async function getLineaMetroDetail(): Promise<LineaMetroDetail> {
  const response = await fetch(`${API}/metro/lineas`);
  return response.json();
}
