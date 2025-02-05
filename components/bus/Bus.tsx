"use client";

import { LlegadasBus, ParadaBus } from "@/interfaces/bus";
import { getLlegadasBus } from "@/lib/bus";
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

  const handleParadaChange = (newParada: ParadaBus | undefined) => {
    setSelectedParada(newParada);
    const params = new URLSearchParams(searchParams.toString());
    if (newParada) {
      params.set('id', newParada.id.toString());
    } else {
      params.delete('id');
    }
    router.push(`/bus?${params.toString()}`);
  };

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
      <div className="flex gap-2">
        <ParadasBusSelect
          initialParada={initialParada}
          onParadaChange={handleParadaChange}
        />
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
