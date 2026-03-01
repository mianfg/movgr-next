export interface LineaBus {
  id: string;
  nombre?: string;
  color?: string;
  text_color?: string;
}

export interface ProximoBus {
  linea: LineaBus;
  destino: string;
  minutos: number;
}

export interface ParadaBus {
  id: number;
  nombre: string;
  lat?: number;
  lon?: number;
  lineas?: string[];
}

export interface LlegadasBus {
  parada: ParadaBus;
  proximos: ProximoBus[];
}
