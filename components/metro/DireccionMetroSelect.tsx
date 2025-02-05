"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DireccionMetro } from "@/interfaces/metro";
import clsx from "clsx";
import { ChevronsUpIcon } from "lucide-react";
import { useEffect, useState } from "react";

type DireccionMetroSelectProps = {
  direccion: DireccionMetro;
  onDireccionChange: (direccion: DireccionMetro) => void;
  isInverted: boolean;
}

export function DireccionMetroSelect({ direccion, onDireccionChange, isInverted }: DireccionMetroSelectProps) {
  const [shouldRotate, setShouldRotate] = useState(false);

  useEffect(() => {
    setShouldRotate(
      isInverted
        ? direccion !== DireccionMetro.Armilla
        : direccion === DireccionMetro.Armilla
    );
  }, [direccion, isInverted]);

  return (
    <Select value={direccion} onValueChange={onDireccionChange}>
      <SelectTrigger className="w-full">
        <ChevronsUpIcon
          className={clsx(
            "h-5 w-5 mr-2 transition-all",
            shouldRotate && "rotate-180"
          )}
        />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sentido</SelectLabel>
          <SelectItem value={DireccionMetro.Armilla}>Armilla</SelectItem>
          <SelectItem value={DireccionMetro.Albolote}>Albolote</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
