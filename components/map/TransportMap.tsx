"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { Button } from "@/components/ui/button";
import { ParadaBus, LineaBus } from "@/interfaces/bus";
import { ParadaMetro } from "@/interfaces/metro";
import { LineaBusDetail, LineaMetroDetail } from "@/interfaces/map";
import { getParadasBus, getLineasBus, getLineaBusDetail } from "@/lib/bus";
import { getParadasMetro, getLineaMetroDetail } from "@/lib/metro";
import { ArrowLeftIcon, BusFrontIcon, LocateIcon, RouteIcon, TramFrontIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { StopDrawer } from "./StopDrawer";

const GRANADA_CENTER: L.LatLngExpression = [37.176, -3.599];
const LIGHT_TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';
const METRO_COLOR = "#e11d48";

type SelectedStop =
  | { type: "bus"; parada: ParadaBus }
  | { type: "metro"; parada: ParadaMetro }
  | null;

function ThemeAwareTiles() {
  const { resolvedTheme } = useTheme();
  const url = resolvedTheme === "dark" ? DARK_TILES : LIGHT_TILES;
  return <TileLayer attribution={TILE_ATTRIBUTION} url={url} />;
}

function LocationMarker() {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  const locate = useCallback(() => {
    map.locate({ setView: true, maxZoom: 16 });
  }, [map]);

  useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
    },
  });

  useEffect(() => {
    const btn = document.getElementById("locate-btn");
    if (btn) {
      const handler = () => locate();
      btn.addEventListener("click", handler);
      return () => btn.removeEventListener("click", handler);
    }
  }, [locate]);

  if (!position) return null;

  return (
    <CircleMarker
      center={position}
      radius={8}
      pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 1, weight: 3 }}
    />
  );
}

type TransportMapInnerProps = {
  busStops: ParadaBus[];
  metroStops: ParadaMetro[];
  busLineDetails: LineaBusDetail[];
  metroLineDetail: LineaMetroDetail | null;
  busLineasMap: Map<string, LineaBus>;
  onStopClick: (stop: SelectedStop) => void;
  showBusStops: boolean;
  showMetroStops: boolean;
  showLines: boolean;
};

function TransportMapInner({
  busStops,
  metroStops,
  busLineDetails,
  metroLineDetail,
  busLineasMap,
  onStopClick,
  showBusStops,
  showMetroStops,
  showLines,
}: TransportMapInnerProps) {
  const busPolylines = useMemo(() => {
    if (!showLines) return null;
    return busLineDetails.flatMap((line) =>
      line.shapes.map((shape, i) => {
        const positions: L.LatLngExpression[] = shape.points.map((p) => [p.lat, p.lon]);
        return (
          <Polyline
            key={`bus-${line.id}-${i}`}
            positions={positions}
            pathOptions={{
              color: line.color ? `#${line.color}` : "#6b7280",
              weight: 3,
              opacity: 0.7,
            }}
          />
        );
      })
    );
  }, [busLineDetails, showLines]);

  const metroPolylines = useMemo(() => {
    if (!showLines || !metroLineDetail) return null;
    return metroLineDetail.shapes.map((shape, i) => {
      const positions: L.LatLngExpression[] = shape.points.map((p) => [p.lat, p.lon]);
      return (
        <Polyline
          key={`metro-${i}`}
          positions={positions}
          pathOptions={{ color: METRO_COLOR, weight: 4, opacity: 0.8 }}
        />
      );
    });
  }, [metroLineDetail, showLines]);

  return (
    <>
      <ThemeAwareTiles />
      <LocationMarker />

      {showLines && busPolylines}
      {showLines && metroPolylines}

      {showBusStops &&
        busStops.map((stop) => {
          if (stop.lat == null || stop.lon == null) return null;
          const lineIds = stop.lineas || [];
          const firstLine = lineIds.length > 0 ? busLineasMap.get(lineIds[0]) : undefined;
          const color = firstLine?.color ? `#${firstLine.color}` : "#6b7280";
          return (
            <CircleMarker
              key={`bus-${stop.id}`}
              center={[stop.lat, stop.lon]}
              radius={5}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.8, weight: 1 }}
              eventHandlers={{
                click: () => onStopClick({ type: "bus", parada: stop }),
              }}
            />
          );
        })}

      {showMetroStops &&
        metroStops.map((stop) => {
          if (stop.lat == null || stop.lon == null) return null;
          return (
            <CircleMarker
              key={`metro-${stop.id}`}
              center={[stop.lat, stop.lon]}
              radius={7}
              pathOptions={{
                color: METRO_COLOR,
                fillColor: METRO_COLOR,
                fillOpacity: 0.9,
                weight: 2,
              }}
              eventHandlers={{
                click: () => onStopClick({ type: "metro", parada: stop }),
              }}
            />
          );
        })}
    </>
  );
}

export function TransportMap() {
  const router = useRouter();
  const [busStops, setBusStops] = useState<ParadaBus[]>([]);
  const [metroStops, setMetroStops] = useState<ParadaMetro[]>([]);
  const [busLineas, setBusLineas] = useState<LineaBus[]>([]);
  const [busLineDetails, setBusLineDetails] = useState<LineaBusDetail[]>([]);
  const [metroLineDetail, setMetroLineDetail] = useState<LineaMetroDetail | null>(null);
  const [selectedStop, setSelectedStop] = useState<SelectedStop>(null);
  const [showBusStops, setShowBusStops] = useState(true);
  const [showMetroStops, setShowMetroStops] = useState(true);
  const [showLines, setShowLines] = useState(true);

  const busLineasMap = useMemo(() => {
    const m = new Map<string, LineaBus>();
    busLineas.forEach((l) => m.set(l.id, l));
    return m;
  }, [busLineas]);

  useEffect(() => {
    Promise.all([getParadasBus(), getParadasMetro(), getLineasBus(), getLineaMetroDetail()])
      .then(([bs, ms, bl, ml]) => {
        setBusStops(bs);
        setMetroStops(ms);
        setBusLineas(bl);
        setMetroLineDetail(ml);

        Promise.all(bl.map((l) => getLineaBusDetail(l.id).catch(() => null)))
          .then((details) => {
            setBusLineDetails(details.filter((d): d is LineaBusDetail => d !== null));
          });
      });
  }, []);

  const handleStopClick = useCallback((stop: SelectedStop) => {
    setSelectedStop(stop);
  }, []);

  return (
    <div className="h-[100dvh] w-full relative">
      <MapContainer
        center={GRANADA_CENTER}
        zoom={14}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TransportMapInner
          busStops={busStops}
          metroStops={metroStops}
          busLineDetails={busLineDetails}
          metroLineDetail={metroLineDetail}
          busLineasMap={busLineasMap}
          onStopClick={handleStopClick}
          showBusStops={showBusStops}
          showMetroStops={showMetroStops}
          showLines={showLines}
        />
      </MapContainer>

      {/* Floating controls */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Button
          variant="outline"
          size="icon"
          className="bg-background/90 backdrop-blur-sm shadow-md"
          onClick={() => router.push("/bus")}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <Button
          variant={showBusStops ? "default" : "outline"}
          size="icon"
          className="bg-background/90 backdrop-blur-sm shadow-md"
          onClick={() => setShowBusStops(!showBusStops)}
          title="Bus stops"
        >
          <BusFrontIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={showMetroStops ? "default" : "outline"}
          size="icon"
          className="bg-background/90 backdrop-blur-sm shadow-md"
          onClick={() => setShowMetroStops(!showMetroStops)}
          title="Metro stops"
        >
          <TramFrontIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={showLines ? "default" : "outline"}
          size="icon"
          className="bg-background/90 backdrop-blur-sm shadow-md"
          onClick={() => setShowLines(!showLines)}
          title="Route lines"
        >
          <RouteIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute bottom-6 right-4 z-[1000]">
        <Button
          id="locate-btn"
          variant="outline"
          size="icon"
          className="bg-background/90 backdrop-blur-sm shadow-md"
          title="Mi ubicación"
        >
          <LocateIcon className="h-4 w-4" />
        </Button>
      </div>

      <StopDrawer
        selectedStop={selectedStop}
        onClose={() => setSelectedStop(null)}
        busLineasMap={busLineasMap}
      />
    </div>
  );
}
