import { LlegadasBus, ParadaBus, LineaBus } from "@/interfaces/bus";
import { LineaBusDetail } from "@/interfaces/map";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function getLlegadasBus(num_parada: number): Promise<LlegadasBus | null> {
  const response = await fetch(`${API}/bus/llegadas/${num_parada}`);
  if (response.ok) {
    return response.json();
  }
  return null;
}

export async function getParadaBus(num_parada: number): Promise<ParadaBus | null> {
  const response = await fetch(`${API}/bus/parada/${num_parada}`);
  if (response.ok) {
    return response.json();
  }
  return null;
}

export async function getParadasBus(): Promise<ParadaBus[]> {
  const response = await fetch(`${API}/bus/paradas`);
  return response.json();
}

export async function getLineasBus(): Promise<LineaBus[]> {
  const response = await fetch(`${API}/bus/lineas`);
  return response.json();
}

export async function getLineaBusDetail(id: string): Promise<LineaBusDetail> {
  const response = await fetch(`${API}/bus/lineas/${id}`);
  return response.json();
}
