"use client";

import { Check, ChevronsUpDown, Loader2Icon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ParadaMetro } from "@/interfaces/metro";
import { cn } from "@/lib/utils";

type ParadasMetroSelectProps = {
  paradas: ParadaMetro[];
  value?: ParadaMetro;
  onValueChange: (parada: ParadaMetro | undefined) => void;
  isInverted: boolean;
  isLoading?: boolean;
}

export function ParadasMetroSelect({ paradas, value, onValueChange, isInverted, isLoading }: ParadasMetroSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredParadas = React.useMemo(() => {
    const searchTerm = search.toLowerCase();
    return paradas.filter((parada) =>
      parada.nombre.toLowerCase().includes(searchTerm)
    );
  }, [paradas, search]);

  const displayParadas = isInverted ? [...filteredParadas].reverse() : filteredParadas;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between truncate"
        >
          {value ? (
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="truncate">{value.nombre}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="truncate">Buscar parada...</span>
            </div>
          )}
          <ChevronsUpDown className="opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Buscar parada..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>{isLoading && paradas.length == 0 ? <div className="flex items-center gap-2 w-full justify-center"><Loader2Icon className="h-4 w-4 animate-spin" /> Cargando datos...</div> : "Parada no encontrada"}</CommandEmpty>
            <CommandGroup>
              {displayParadas.map((parada) => (
                <CommandItem
                  key={parada.id}
                  onSelect={() => {
                    onValueChange(value?.id === parada.id ? undefined : parada);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {parada.nombre}
                  <Check
                    className={cn(
                      "ml-auto",
                      value?.id === parada.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
