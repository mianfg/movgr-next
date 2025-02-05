import { LlegadasBus, ParadaBus } from "@/interfaces/bus";

export async function getLlegadasBus(num_parada: number): Promise<LlegadasBus | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bus/llegadas/${num_parada}`, {
    method: 'GET',
  });
  if (response.ok) {
    return response.json();
  }
  return null;
}

export async function getParadaBus(num_parada: number): Promise<ParadaBus | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bus/parada/${num_parada}`, {
    method: 'GET',
  });
  if (response.ok) {
    return response.json();
  }
  return null;
}
