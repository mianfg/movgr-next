import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DireccionMetro, LlegadasMetro, ParadaMetro } from "@/interfaces/metro";
import clsx from "clsx";
import { ArrowUpDownIcon, ChevronsUpIcon, CircleOffIcon, CloudAlertIcon, Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

type LlegadasMetroScrollProps = {
  llegadas: LlegadasMetro[];
  direccion: DireccionMetro;
  parada?: ParadaMetro;
  isLoading?: boolean;
  isOnline?: boolean;
  isInverted: boolean;
  onInvertChange: () => void;
}

export function LlegadasMetroScroll({ llegadas, direccion, parada, isLoading, isOnline, isInverted, onInvertChange }: LlegadasMetroScrollProps) {
  const selectedParadaRef = useRef<HTMLLIElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef<number>(0);
  const [shouldRotate, setShouldRotate] = useState(false);

  useEffect(() => {
    if (scrollAreaRef.current) {
      lastScrollPosition.current = scrollAreaRef.current.scrollTop;
    }
  }, [llegadas, direccion]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = lastScrollPosition.current;
    }
  }, [llegadas, direccion, parada]);

  useEffect(() => {
    if (parada && selectedParadaRef.current) {
      setTimeout(() => {
        selectedParadaRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 0);
    }
  }, [parada, llegadas]);

  useEffect(() => {
    setShouldRotate(
      isInverted
        ? direccion !== DireccionMetro.Armilla
        : direccion === DireccionMetro.Armilla
    );
  }, [direccion, isInverted]);

  const displayLlegadas = isInverted ? [...llegadas].reverse() : llegadas;

  return (
    <>
      <div className="flex-1 min-h-0">
        <ScrollArea className={clsx("h-full w-full rounded-md border relative", llegadas.length > 0 && "rounded-b-none")}>
          <div ref={scrollAreaRef} className="ml-3 p-4 pb-0">
            <ol className="relative border-s border-zinc-300 dark:border-zinc-700">
              {displayLlegadas.map((llegada, index) => (
                <li key={llegada.parada.id} ref={llegada.parada.id === parada?.id ? selectedParadaRef : null}>
                  <div className="mb-4 ms-4 py-1 h-8">
                    <div className={clsx("absolute w-3 h-3 rounded-full mt-1.5 -start-1.5 border border-white dark:border-black", parada && parada.id === llegada.parada.id ? "dark:bg-white bg-zinc-500" : " dark:bg-zinc-700 bg-zinc-300")}></div>
                    <div className={clsx("flex w-full items-center gap-4", parada && parada.id !== llegada.parada.id && "opacity-30")}>
                      <div className="min-w-0 flex-1 max-w-[60%]">
                        <div className="truncate text-sm">{llegada.parada.nombre}</div>
                      </div>
                      <div className="flex-shrink-0 ml-auto flex gap-2">
                        {llegada.proximos.length > 0 && llegada.proximos.filter((proximo) => proximo.direccion === direccion).map((proximo, index) => (
                          proximo.minutos === 0 ?
                            <Badge key={index} variant="destructive">&lt; 1 min</Badge>
                            : <Badge key={index} variant="secondary">{proximo.minutos} min</Badge>
                        ))}
                        {llegada.proximos.filter((proximo) => proximo.direccion === direccion).length == 0 && (direccion as string) !== llegada.parada.nombre && <Badge variant="outline" className="font-normal"><CircleOffIcon className="h-3 w-3 mr-2"/>Sin trenes</Badge>}
                      </div>
                    </div>
                  </div>
                  {index !== displayLlegadas.length - 1 && (
                    <ChevronsUpIcon
                      className={clsx(
                        "-ml-2 -mt-4 h-4 w-4 transition-all",
                        shouldRotate && "rotate-180",
                        parada ? (
                          isInverted ? (
                            index === displayLlegadas.findIndex(l => l.parada.id === parada.id) - 1 ||
                        index === displayLlegadas.findIndex(l => l.parada.id === parada.id)
                              ? "text-zinc-500 dark:text-zinc-300"
                              : "text-zinc-300 dark:text-zinc-700"
                          ) : (
                            index === displayLlegadas.findIndex(l => l.parada.id === parada.id) ||
                        index === displayLlegadas.findIndex(l => l.parada.id === parada.id) - 1
                              ? "text-zinc-500 dark:text-zinc-300"
                              : "text-zinc-300 dark:text-zinc-700"
                          )
                        ) : "text-zinc-300 dark:text-zinc-700"
                      )}
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>
          {isLoading && llegadas.length == 0 && (
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
          {isLoading && llegadas.length > 0 && <div className="absolute bottom-0 h-8 flex items-center justify-center text-xs bg-gray-100 dark:bg-zinc-900 left-0 right-0 bg-background border-t">
            <Loader2Icon className="h-4 w-4 animate-spin mr-2" /> Actualizando...
          </div>}
        </ScrollArea>
      </div>
      {!(isLoading && llegadas.length == 0) && <Button
        onClick={onInvertChange}
        className="w-full text-xs h-8 rounded-none rounded-b-md border-t-0"
        variant="outline"
      >
        <ArrowUpDownIcon className={clsx(
          "h-3 w-3 transition-all",
          shouldRotate && "rotate-180"
        )} />
        Invertir orden
      </Button>}
    </>
  );
}
