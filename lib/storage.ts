import { ParadaBus } from "@/interfaces/bus";
import { DireccionMetro, ParadaMetro } from "@/interfaces/metro";

export function getStoredDireccion(): DireccionMetro {
  if (typeof window === 'undefined') return DireccionMetro.Armilla;

  const stored = localStorage.getItem('direccionMetro');
  return stored ? JSON.parse(stored) : DireccionMetro.Armilla;
}

export function setStoredDireccion(direccion: DireccionMetro): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('direccionMetro', JSON.stringify(direccion));
}

export function getStoredParada(): ParadaMetro | undefined {
  if (typeof window === 'undefined') return undefined;

  const stored = localStorage.getItem('paradaMetro');
  return stored ? JSON.parse(stored) : undefined;
}

export function setStoredParada(parada: ParadaMetro | undefined): void {
  if (typeof window === 'undefined') return;

  if (parada) {
    localStorage.setItem('paradaMetro', JSON.stringify(parada));
  } else {
    localStorage.removeItem('paradaMetro');
  }
}

export function getStoredParadaBus(): ParadaBus | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('paradaBus');
  return stored ? JSON.parse(stored) : null;
}

export function setStoredParadaBus(parada: ParadaBus | null): void {
  if (typeof window === 'undefined') return;

  if (parada) {
    localStorage.setItem('paradaBus', JSON.stringify(parada));
  } else {
    localStorage.removeItem('paradaBus');
  }
}

export function getStoredMetroInvert(): boolean {
  if (typeof window === 'undefined') return false;

  const stored = localStorage.getItem('metroInvert');
  return stored ? JSON.parse(stored) : false;
}

export function toggleStoredMetroInvert(): boolean {
  if (typeof window === 'undefined') return false;

  const currentValue = getStoredMetroInvert();
  const newValue = !currentValue;
  localStorage.setItem('metroInvert', JSON.stringify(newValue));
  return newValue;
}