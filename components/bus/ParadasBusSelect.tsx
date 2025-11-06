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
import { ChevronsUpDown, Star } from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "../ui/badge";

type ParadasSelectProps = {
  initialParada?: ParadaBus;
  onParadaChange: (parada: ParadaBus | undefined) => void;
  favorites?: ParadaBus[];
}

export function ParadasBusSelect({ initialParada, onParadaChange, favorites = [] }: ParadasSelectProps) {
  const [openSearch, setOpenSearch] = useState(false);
  const [openFavorites, setOpenFavorites] = useState(false);
  const [value, setValue] = useState("");
  const [storedParada, setStoredParada] = useState<ParadaBus | null>(initialParada || null);
  const [searchParada, setSearchParada] = useState<ParadaBus | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchOpenChange = (newOpen: boolean) => {
    setOpenSearch(newOpen);
    if (newOpen) {
      setValue("");
      setSearchParada(null);
      setError(null);
      setIsSearching(false);
    }
  };

  const handleFavoritesOpenChange = (newOpen: boolean) => {
    setOpenFavorites(newOpen);
  };

  const openFavoritesDrawer = () => {
    setOpenSearch(false);
    // Small delay to allow search drawer to close first
    setTimeout(() => {
      setOpenFavorites(true);
    }, 150);
  };

  const openSearchDrawer = () => {
    setOpenFavorites(false);
    // Small delay to allow favorites drawer to close first
    setTimeout(() => {
      setOpenSearch(true);
    }, 150);
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
      setOpenSearch(false);
    }
  };

  const handleSelectFavorite = (parada: ParadaBus) => {
    setStoredParada(parada);
    onParadaChange(parada);
    setOpenFavorites(false);
  };

  return (
    <>
      <Drawer open={openSearch} onOpenChange={handleSearchOpenChange}>
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
              <div className="flex flex-col gap-2 w-full">
                <Button
                  disabled={!searchParada}
                  onClick={handleSelect}
                >
                  Seleccionar
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={openFavoritesDrawer}
                    className="flex-1"
                  >
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    Ver favoritos
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="flex-1">Cancelar</Button>
                  </DrawerClose>
                </div>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={openFavorites} onOpenChange={handleFavoritesOpenChange}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Paradas favoritas</DrawerTitle>
              <DrawerDescription>Selecciona una parada de tus favoritos</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              {favorites.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                  {favorites.map((parada) => (
                    <Button
                      key={parada.id}
                      variant="outline"
                      className="w-full justify-start h-auto py-3"
                      onClick={() => handleSelectFavorite(parada)}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Star className="h-4 w-4 fill-current flex-shrink-0 text-yellow-500" />
                        <Badge variant="outline">{parada.id}</Badge>
                        <span className="truncate text-sm">{parada.nombre}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  <div className="mb-4 flex justify-center">
                    <Star className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <p className="mb-2">No tienes paradas favoritas</p>
                  <p className="text-xs">
                    Marca una parada como favorita con el botón de estrella
                  </p>
                </div>
              )}
            </div>
            <DrawerFooter>
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={openSearchDrawer}
                  className="flex-1"
                >
                  Buscar parada
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" className="flex-1">Cancelar</Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
