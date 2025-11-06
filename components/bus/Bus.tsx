"use client";

import { Button } from "@/components/ui/button";
import { LlegadasBus, ParadaBus } from "@/interfaces/bus";
import { getLlegadasBus } from "@/lib/bus";
import { getFavoriteParadasBus, isFavoriteParadaBus, toggleFavoriteParadaBus } from "@/lib/storage";
import { Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LlegadasBusScroll } from "./LlegadasBusScroll";
import { ParadasBusSelect } from "./ParadasBusSelect";

type BusProps = {
  initialParada?: ParadaBus;
}

export function Bus({ initialParada }: BusProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [llegadas, setLlegadas] = useState<LlegadasBus | null>(null);
  const [selectedParada, setSelectedParada] = useState<ParadaBus | undefined>(initialParada);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState<ParadaBus[]>([]);

  const handleParadaChange = (newParada: ParadaBus | undefined) => {
    setSelectedParada(newParada);
    const params = new URLSearchParams(searchParams.toString());
    if (newParada) {
      params.set('id', newParada.id.toString());
      setIsFavorite(isFavoriteParadaBus(newParada.id));
    } else {
      params.delete('id');
      setIsFavorite(false);
    }
    router.push(`/bus?${params.toString()}`);
  };

  const handleToggleFavorite = () => {
    if (selectedParada) {
      const newFavoriteState = toggleFavoriteParadaBus(selectedParada);
      setIsFavorite(newFavoriteState);
      setFavorites(getFavoriteParadasBus());
    }
  };

  useEffect(() => {
    setFavorites(getFavoriteParadasBus());
    if (selectedParada) {
      setIsFavorite(isFavoriteParadaBus(selectedParada.id));
    }
  }, [selectedParada]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedParada) {
        setLlegadas(null);
        return;
      }

      setIsLoading(true);
      try {
        const llegadasData = await getLlegadasBus(selectedParada.id);
        setLlegadas(llegadasData);
        setIsOnline(true);
      } catch (e) {
        console.error(e);
        setIsOnline(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, [selectedParada]);

  return (
    <>
      <div className="flex gap-2 w-full">
        <div className="flex-1 min-w-0">
          <ParadasBusSelect
            initialParada={initialParada}
            onParadaChange={handleParadaChange}
            favorites={favorites}
          />
        </div>
        {selectedParada && (
          <Button
            variant={isFavorite ? "default" : "outline"}
            size="icon"
            className="flex-shrink-0"
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            {isFavorite ? (
              <Star className="h-4 w-4 fill-current" />
            ) : (
              <Star className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <div className="flex justify-between gap-2 mt-4 mb-2 px-4">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Próximos buses</h2>
        </div>
        {(llegadas != null || (selectedParada != undefined && llegadas == null)) && (<div className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          <span className="text-sm text-zinc-900 dark:text-zinc-100">
            {isOnline ? "En directo" : "Sin conexión"}
          </span>
          {isOnline ? (
            <span className="relative ml-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            </span>
          ) : (
            <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-500 dark:bg-yellow-400"></span>
          )}
        </div>)}
      </div>
      <LlegadasBusScroll
        llegadas={llegadas}
        parada={selectedParada}
        isLoading={isLoading}
        isOnline={isOnline}
      />
    </>
  );
}
