"use client";

import { DireccionMetro, LlegadasMetro, ParadaMetro } from "@/interfaces/metro";
import { getLlegadasMetro, getParadasMetro } from "@/lib/metro";
import { getStoredMetroInvert, toggleStoredMetroInvert } from "@/lib/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DireccionMetroSelect } from "./DireccionMetroSelect";
import { LlegadasMetroScroll } from "./LlegadasMetroScroll";
import { ParadasMetroSelect } from "./ParadasMetroSelect";

type MetroProps = {
  initialParada?: ParadaMetro;
  initialDireccion: DireccionMetro;
}

export function Metro({ initialParada, initialDireccion }: MetroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [llegadas, setLlegadas] = useState<LlegadasMetro[]>([]);
  const [paradas, setParadas] = useState<ParadaMetro[]>([]);
  const [direccion, setDireccion] = useState<DireccionMetro>(initialDireccion);
  const [selectedParada, setSelectedParada] = useState<ParadaMetro | undefined>(initialParada);
  const [isOnline, setIsOnline] = useState(true);
  const [isInverted, setIsInverted] = useState(getStoredMetroInvert());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [llegadasData, paradasData] = await Promise.all([
          getLlegadasMetro(),
          getParadasMetro()
        ]);
        setLlegadas(llegadasData);
        setParadas(paradasData);
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
  }, []);

  const handleDireccionChange = (newDireccion: DireccionMetro) => {
    setDireccion(newDireccion);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sentido', newDireccion);
    router.push(`/metro?${params.toString()}`);
  };

  const handleParadaChange = (newParada: ParadaMetro | undefined) => {
    setSelectedParada(newParada);
    const params = new URLSearchParams(searchParams.toString());
    if (newParada) {
      params.set('id', newParada.id);
    } else {
      params.delete('id');
    }
    router.push(`/metro?${params.toString()}`);
  };

  const handleInvertChange = (inverted: boolean) => {
    setLlegadas([...llegadas]);
    setIsInverted(inverted);
  };

  const handleToggleInvert = () => {
    const newValue = toggleStoredMetroInvert();
    setIsInverted(newValue);
    handleInvertChange(newValue);
  };

  return (
    <>
      <div className="flex gap-2 w-full">
        <div className="flex-1 flex gap-2 min-w-0">
          <div className="flex-[3] min-w-0">
            <ParadasMetroSelect
              paradas={paradas}
              value={selectedParada}
              onValueChange={handleParadaChange}
              isInverted={isInverted}
              isLoading={isLoading}
            />
          </div>
          <div className="flex-[2] min-w-0">
            <DireccionMetroSelect
              direccion={direccion}
              onDireccionChange={handleDireccionChange}
              isInverted={isInverted}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-2 mt-4 mb-2 px-4">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Próximos trenes</h2>
        </div>
        {(!isLoading || llegadas.length > 0) && (<div className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
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

      <LlegadasMetroScroll
        llegadas={llegadas}
        direccion={direccion}
        parada={selectedParada}
        isLoading={isLoading}
        isOnline={isOnline}
        isInverted={isInverted}
        onInvertChange={handleToggleInvert}
      />
    </>
  );
}
