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

export function getFavoriteParadasBus(): ParadaBus[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem('favoriteParadasBus');
  return stored ? JSON.parse(stored) : [];
}

export function setFavoriteParadasBus(paradas: ParadaBus[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('favoriteParadasBus', JSON.stringify(paradas));
}

export function toggleFavoriteParadaBus(parada: ParadaBus): boolean {
  if (typeof window === 'undefined') return false;

  const favorites = getFavoriteParadasBus();
  const index = favorites.findIndex(p => p.id === parada.id);
  
  if (index > -1) {
    // Remove from favorites
    favorites.splice(index, 1);
    setFavoriteParadasBus(favorites);
    return false;
  } else {
    // Add to favorites
    favorites.push(parada);
    setFavoriteParadasBus(favorites);
    return true;
  }
}

export function isFavoriteParadaBus(paradaId: number): boolean {
  if (typeof window === 'undefined') return false;

  const favorites = getFavoriteParadasBus();
  return favorites.some(p => p.id === paradaId);
}