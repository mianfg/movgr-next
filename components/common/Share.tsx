"use client";

import { ShareIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { ParadaBus } from "@/interfaces/bus";
import { DireccionMetro, ParadaMetro } from "@/interfaces/metro";
import QRCode from "react-qr-code";
import { toast } from "sonner";

export type ShareProps = {
  initialParadaMetro?: ParadaMetro
  initialParadaBus?: ParadaBus
  direccionMetro?: DireccionMetro
  compact?: boolean
}

export function Share({ initialParadaMetro, initialParadaBus, direccionMetro, compact }: ShareProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullUrl = typeof window !== "undefined"
    ? `${window.location.origin}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
    : "";
  const stopId = searchParams.get("id");
  const hasStop = Boolean(initialParadaMetro || initialParadaBus || stopId);
  const sentido = searchParams.get("sentido") || direccionMetro;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {compact ? (
          <Button variant="outline" size="icon" className="bg-background/90 backdrop-blur-sm shadow-md" aria-label="Compartir">
            <ShareIcon />
          </Button>
        ) : (
          <Button variant="outline" className="w-full"><ShareIcon/>Compartir</Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Compartir</DrawerTitle>
            <DrawerDescription>{hasStop ? "Comparte el estado de esta parada" : "Comparte esta aplicación"}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center">
              <QRCode value={fullUrl} className="w-40 h-40 dark:invert mb-8" />
            </div>
            {!hasStop ? (
              <Alert>
                <AlertTitle className="mb-4">Comparte el estado de una parada</AlertTitle>
                <AlertDescription>
                  <p>
                    Una vez que selecciones una parada, puedes compartir su estado con quien quieras.
                  </p>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertTitle className="mb-4">Compartiendo parada</AlertTitle>
                <AlertDescription>
                  <p>
                    Al escanear este QR se abre movGR en esta parada. Si la app de iOS está instalada, se abre ahí.
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DrawerFooter>
            <Button onClick={async () => {
              if (navigator?.share) {
                try {
                  await navigator.share({
                    title: initialParadaMetro
                      ? `Metro: ${initialParadaMetro.nombre} sentido ${direccionMetro}`
                      : initialParadaBus
                        ? `Bus: ${initialParadaBus.id} (${initialParadaBus.nombre})`
                        : hasStop
                          ? `movGR: parada ${stopId}${sentido ? ` sentido ${sentido}` : ""}`
                          : "movGR",
                    text: initialParadaMetro
                      ? `Sigue en movGR la parada de metro ${initialParadaMetro.nombre} sentido ${direccionMetro}`
                      : initialParadaBus
                        ? `Sigue en movGR la parada de autobús ${initialParadaBus.id} (${initialParadaBus.nombre})`
                        : `Sigue en directo el transporte público de Granada`,
                    url: fullUrl
                  });
                } catch (error) {
                  console.error("Error compartiendo:", error);
                }
              } else {
                try {
                  await navigator.clipboard.writeText(fullUrl);
                  toast.success("URL copiada al portapapeles");
                } catch {
                  toast.error("Error al intentar compartir");
                }
              }
            }}>Compartir</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
