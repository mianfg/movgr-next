"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { ParadaBus } from "@/interfaces/bus";
import { getParadaBus } from "@/lib/bus";
import { ChevronsUpDown } from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "../ui/badge";

type ParadasSelectProps = {
  initialParada?: ParadaBus;
  onParadaChange: (parada: ParadaBus | undefined) => void;
}

export function ParadasBusSelect({ initialParada, onParadaChange }: ParadasSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [storedParada, setStoredParada] = useState<ParadaBus | null>(initialParada || null);
  const [searchParada, setSearchParada] = useState<ParadaBus | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setValue("");
      setSearchParada(null);
      setError(null);
      setIsSearching(false);
    }
  };

  const handleValueChange = async (value: string) => {
    setValue(value);
    if (value.length === 0) {
      setSearchParada(null);
      setError(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Clear any previous timeouts
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      // Wait for user to finish typing
      await new Promise<void>(resolve => {
        searchTimeout.current = setTimeout(resolve, 2000);
      });

      const result = await getParadaBus(parseInt(value));
      if (result) {
        setSearchParada(result);
        setError(null);
      } else {
        setSearchParada(null);
        setError("No existe parada con ese número");
      }
    } catch (e) {
      console.error(e);
      setSearchParada(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = () => {
    if (searchParada) {
      setStoredParada(searchParada);
      onParadaChange(searchParada);
      setOpen(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {storedParada ? (
            <>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Badge variant="outline">{storedParada.id}</Badge>
                <span className="truncate">{storedParada.nombre}</span>
              </div>
              <ChevronsUpDown className="opacity-50 flex-shrink-0" />
            </>
          ) : (
            <>
              Seleccionar parada...
              <ChevronsUpDown className="opacity-50" />
            </>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Buscar parada</DrawerTitle>
            <DrawerDescription>Introduce el número de la parada</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <InputOTP
                maxLength={4}
                value={value}
                onChange={handleValueChange}
                className="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-20 w-20 text-5xl font-semibold" />
                  <InputOTPSlot index={1} className="h-20 w-20 text-5xl font-semibold" />
                  <InputOTPSlot index={2} className="h-20 w-20 text-5xl font-semibold" />
                  <InputOTPSlot index={3} className="h-20 w-20 text-5xl font-semibold" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="mt-10 mb-4">
              {(() => {
                if (isSearching) {
                  return (
                    <div className="w-full px-4 h-10 border rounded-md bg-background text-foreground flex items-center justify-start">
                      <span className="text-sm">Buscando parada...</span>
                    </div>
                  );
                } else if (searchParada) {
                  return (
                    <div className="font-medium text-sm w-full px-4 h-10 border rounded-md bg-background text-foreground flex items-center justify-start">
                      <Badge variant="outline" className="mr-2">{searchParada.id}</Badge>
                      <span className="font-medium">{searchParada.nombre}</span>
                    </div>
                  );
                } else if (error) {
                  return (
                    <div className="w-full px-4 h-10 border rounded-md bg-background text-foreground flex items-center justify-start">
                      <span className="text-sm">{error}</span>
                    </div>
                  );
                } else if (value.length === 0) {
                  return (
                    <div className="w-full px-4 h-10 border rounded-md bg-background text-foreground flex items-center justify-start">
                      <span className="text-sm">Inserta un número de parada</span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
          <DrawerFooter>
            <Button
              disabled={!searchParada}
              onClick={handleSelect}
            >
              Seleccionar
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
