export interface LineaBus {
  id: string;
  nombre?: string;
}

export interface ProximoBus {
  linea: LineaBus;
  destino: string;
  minutos: number;
}

export interface ParadaBus {
  id: number;
  nombre: string;
}

export interface LlegadasBus {
  parada: ParadaBus;
  proximos: ProximoBus[];
}
