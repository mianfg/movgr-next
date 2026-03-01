export interface ShapePoint {
  lat: number;
  lon: number;
}

export interface RouteShape {
  direction: number;
  points: ShapePoint[];
}

export interface LineaBusDetail {
  id: string;
  nombre?: string;
  color?: string;
  text_color?: string;
  shapes: RouteShape[];
}

export interface LineaMetroDetail {
  id: string;
  nombre?: string;
  shapes: RouteShape[];
}
