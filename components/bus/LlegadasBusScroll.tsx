"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { LlegadasBus, ParadaBus } from "@/interfaces/bus";
import { CircleOffIcon, CloudAlertIcon, Loader2Icon, MousePointerClickIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Badge } from "../ui/badge";

type LlegadasBusScrollProps = {
  llegadas?: LlegadasBus | null;
  parada?: ParadaBus;
  isLoading?: boolean;
  isOnline?: boolean;
}



export function LlegadasBusScroll({ llegadas, parada, isLoading, isOnline }: LlegadasBusScrollProps) {
  const selectedParadaRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (selectedParadaRef.current) {
      setTimeout(() => {
        selectedParadaRef.current?.scrollIntoView({
          behavior: "instant",
          block: "center"
        });
      }, 0);
    }
  }, [llegadas]);

  return (
    <div className="flex-1 min-h-0">
      <ScrollArea className="h-full w-full rounded-md border relative">
        <div className="p-4">
          <ol className="flex flex-col gap-4">
            {llegadas?.proximos.map((proximo, index) => (
              <li key={index} className="flex w-full items-center gap-4">
                <Image
                  src={`/bus/lineas/${proximo.linea.id}.png`}
                  className="h-8 w-8 flex-shrink-0"
                  alt={`Icono de línea ${proximo.linea.id}`}
                  width={40}
                  height={40}
                />
                <div className="flex-1 min-w-0 max-w-[60%]">
                  <div className="text-sm">{proximo.linea.nombre}</div>
                </div>
                <div className="flex-shrink-0 ml-auto">
                  {proximo.minutos === 0 ? (
                    <Badge variant="destructive">&lt; 1 min</Badge>
                  ) : (
                    <Badge variant="secondary">{proximo.minutos} min</Badge>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
        {parada == undefined && (
          <div className="z-40 absolute bottom-0 left-0 right-0 top-0 bg-background/90 flex items-center justify-center p-8">
            <div className="text-sm text-zinc-900 dark:text-zinc-100">
              <div className="flex items-center justify-center gap-2 mb-2 font-medium">
                <MousePointerClickIcon className="h-4 w-4" /> Seleccione parada
              </div>
              <div className="text-center text-sm mb-2">Seleccione una parada para ver los autobuses que se aproximan</div>
            </div>
          </div>
        )}
        {((llegadas && llegadas.proximos.length == 0) || (parada != undefined && llegadas == null && !isLoading)) && (
          <div className="z-40 absolute bottom-0 left-0 right-0 top-0 bg-background/90 flex items-center justify-center p-8">
            <div className="text-sm text-zinc-900 dark:text-zinc-100">
              <div className="flex items-center justify-center gap-2 mb-2 font-medium">
                <CircleOffIcon className="h-4 w-4" /> No hay autobuses
              </div>
              <div className="text-center text-sm mb-2">Ningún autobús se está aproximando ahora mismo a esta parada</div>
            </div>
          </div>
        )}
        {isLoading && llegadas == null && (
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-background/80 flex items-center justify-center">
            <div className="text-sm text-zinc-900 dark:text-zinc-100">
              <div className="flex items-center gap-2">
                <Loader2Icon className="h-4 w-4 animate-spin" /> Cargando datos...
              </div>
            </div>
          </div>
        )}
        {!isOnline && (
          <div className="z-40 absolute bottom-0 left-0 right-0 top-0 bg-background/90 flex items-center justify-center p-8">
            <div className="text-sm text-zinc-900 dark:text-zinc-100">
              <div className="flex items-center justify-center gap-2 mb-2 font-medium">
                <CloudAlertIcon className="h-4 w-4" /> Sin conexión
              </div>
              <div className="text-center text-sm mb-2">La información no puede actualizarse. Comprueba tu conexión a Internet</div>
              <div className="text-center text-xs">Se reintentará en unos segundos</div>
            </div>
          </div>
        )}
        {isLoading && llegadas && <div className="absolute bottom-0 h-8 flex items-center justify-center text-xs bg-gray-100 dark:bg-zinc-900 left-0 right-0 bg-background border-t">
          <Loader2Icon className="h-4 w-4 animate-spin mr-2" /> Actualizando...
        </div>}
      </ScrollArea>
    </div>
  );
}
