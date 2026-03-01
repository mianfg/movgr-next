"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LlegadasBus, LineaBus, ParadaBus } from "@/interfaces/bus";
import { DireccionMetro, LlegadasMetro, ParadaMetro } from "@/interfaces/metro";
import { getLlegadasBus } from "@/lib/bus";
import { getLlegadasMetroParada } from "@/lib/metro";
import { BusFrontIcon, CircleOffIcon, Loader2Icon, TramFrontIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { LineBadge } from "./LineBadge";

type SelectedStop =
  | { type: "bus"; parada: ParadaBus }
  | { type: "metro"; parada: ParadaMetro }
  | null;

type StopDrawerProps = {
  selectedStop: SelectedStop;
  onClose: () => void;
  busLineasMap: Map<string, LineaBus>;
};

function BusArrivals({ parada, busLineasMap }: { parada: ParadaBus; busLineasMap: Map<string, LineaBus> }) {
  const [llegadas, setLlegadas] = useState<LlegadasBus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getLlegadasBus(parada.id);
        if (active) setLlegadas(data);
      } catch {
        if (active) setLlegadas(null);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [parada.id]);

  if (isLoading && !llegadas) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        <Loader2Icon className="h-4 w-4 animate-spin mr-2" /> Cargando llegadas...
      </div>
    );
  }

  if (!llegadas || llegadas.proximos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-sm text-muted-foreground">
        <CircleOffIcon className="h-5 w-5 mb-2" />
        No hay autobuses aproximándose
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-[300px]">
      <div className="flex flex-col gap-3 pr-4">
        {llegadas.proximos.map((proximo, i) => {
          const lineInfo = busLineasMap.get(proximo.linea.id);
          return (
            <div key={i} className="flex items-center gap-3">
              <LineBadge
                id={proximo.linea.id}
                color={lineInfo?.color || proximo.linea.color}
                textColor={lineInfo?.text_color || proximo.linea.text_color}
                size="sm"
              />
              <div className="flex-1 min-w-0 text-sm truncate">{proximo.destino}</div>
              <div className="flex-shrink-0">
                {proximo.minutos === 0 ? (
                  <Badge variant="destructive">&lt; 1 min</Badge>
                ) : (
                  <Badge variant="secondary">{proximo.minutos} min</Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function MetroArrivals({ parada }: { parada: ParadaMetro }) {
  const [llegadas, setLlegadas] = useState<LlegadasMetro | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getLlegadasMetroParada(parada.id);
        if (active) setLlegadas(data);
      } catch {
        if (active) setLlegadas(null);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [parada.id]);

  if (isLoading && !llegadas) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        <Loader2Icon className="h-4 w-4 animate-spin mr-2" /> Cargando llegadas...
      </div>
    );
  }

  if (!llegadas || llegadas.proximos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-sm text-muted-foreground">
        <CircleOffIcon className="h-5 w-5 mb-2" />
        Sin información de trenes
      </div>
    );
  }

  const armilla = llegadas.proximos.filter((p) => p.direccion === DireccionMetro.Armilla);
  const albolote = llegadas.proximos.filter((p) => p.direccion === DireccionMetro.Albolote);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          Dirección Albolote
        </div>
        {albolote.length > 0 ? (
          <div className="flex gap-2">
            {albolote.map((p, i) =>
              p.minutos === 0 ? (
                <Badge key={i} variant="destructive">&lt; 1 min</Badge>
              ) : (
                <Badge key={i} variant="secondary">{p.minutos} min</Badge>
              )
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Sin trenes</div>
        )}
      </div>
      <div>
        <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          Dirección Armilla
        </div>
        {armilla.length > 0 ? (
          <div className="flex gap-2">
            {armilla.map((p, i) =>
              p.minutos === 0 ? (
                <Badge key={i} variant="destructive">&lt; 1 min</Badge>
              ) : (
                <Badge key={i} variant="secondary">{p.minutos} min</Badge>
              )
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Sin trenes</div>
        )}
      </div>
    </div>
  );
}

export function StopDrawer({ selectedStop, onClose, busLineasMap }: StopDrawerProps) {
  return (
    <Drawer open={selectedStop !== null} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm pb-6">
          <DrawerHeader>
            {selectedStop?.type === "bus" && (
              <>
                <DrawerTitle className="flex items-center gap-2">
                  <BusFrontIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{selectedStop.parada.nombre}</span>
                </DrawerTitle>
                <DrawerDescription>
                  <Badge variant="outline" className="mr-1">Parada {selectedStop.parada.id}</Badge>
                  Próximos autobuses
                </DrawerDescription>
              </>
            )}
            {selectedStop?.type === "metro" && (
              <>
                <DrawerTitle className="flex items-center gap-2">
                  <TramFrontIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{selectedStop.parada.nombre}</span>
                </DrawerTitle>
                <DrawerDescription>Próximos trenes</DrawerDescription>
              </>
            )}
          </DrawerHeader>
          <div className="px-4">
            {selectedStop?.type === "bus" && (
              <BusArrivals parada={selectedStop.parada} busLineasMap={busLineasMap} />
            )}
            {selectedStop?.type === "metro" && (
              <MetroArrivals parada={selectedStop.parada} />
            )}
          </div>
          <div className="px-4 mt-4">
            <Button variant="outline" className="w-full" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
