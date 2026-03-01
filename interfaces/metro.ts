export enum DireccionMetro {
  Armilla = "Armilla",
  Albolote = "Albolote"
}

export interface ProximoMetro {
  direccion: DireccionMetro;
  minutos: number;
}

export interface ParadaMetro {
  linea: string;
  id: string;
  nombre: string;
  lat?: number;
  lon?: number;
}

export interface LlegadasMetro {
  parada: ParadaMetro;
  proximos: ProximoMetro[];
}
