import { LlegadasMetro, ParadaMetro } from "@/interfaces/metro";

export async function getLlegadasMetro(): Promise<LlegadasMetro[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/metro/llegadas`, {
    method: 'GET',
  });
  return response.json();
}

export async function getParadasMetro(): Promise<ParadaMetro[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/metro/paradas`, {
    method: 'GET',
  });
  return response.json();
}