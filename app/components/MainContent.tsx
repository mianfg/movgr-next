"use client";

import Favicon from "@/app/favicon.svg";
import { Bus } from "@/components/bus/Bus";
import { About } from "@/components/common/About";
import { ModeToggle } from "@/components/common/ModeToggle";
import { Share } from "@/components/common/Share";
import { Metro } from "@/components/metro/Metro";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParadaBus } from "@/interfaces/bus";
import { DireccionMetro, ParadaMetro } from "@/interfaces/metro";
import { BusFrontIcon, TramFrontIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type MainContentProps = {
  defaultTab: string;
  initialParadaMetro?: ParadaMetro;
  initialParadaBus?: ParadaBus;
  initialDireccionMetro?: DireccionMetro;
}

export function MainContent({ defaultTab, initialParadaMetro, initialParadaBus, initialDireccionMetro }: MainContentProps) {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.push(`/${value}`);
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <div className="flex w-full max-w-[400px] mx-auto justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Image src={Favicon} alt="MovGR" className="h-8 w-8 dark:invert" />
          <div className="-mt-[5px]">
            <span className="font-normal text-[24px]">mov</span>
            <span className="text-[18px] font-bold tracking-wide">GR</span>
          </div>
        </div>
        <ModeToggle />
      </div>
      <div className="flex-1 min-h-0 px-4 w-full max-w-[400px] mx-auto">
        <Tabs defaultValue={defaultTab} className="h-full flex flex-col" onValueChange={handleTabChange}>
          <TabsList className="w-full">
            <TabsTrigger value="bus" className="w-full">
              <BusFrontIcon className="h-5 w-5 mr-2"/>
              <span>Bus</span>
            </TabsTrigger>
            <TabsTrigger value="metro" className="w-full">
              <TramFrontIcon className="h-5 w-5 mr-2"/>
              <span>Metro</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="bus"
            className="flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden"
          >
            <Bus initialParada={initialParadaBus} />
          </TabsContent>

          <TabsContent
            value="metro"
            className="flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden"
          >
            <Metro initialParada={initialParadaMetro} initialDireccion={initialDireccionMetro || DireccionMetro.Armilla} />
          </TabsContent>
        </Tabs>
      </div>
      <footer className="p-4 mb-2 max-w-[400px] mx-auto flex justify-end gap-2 w-full">
        <About/>
        <Share initialParadaMetro={initialParadaMetro} initialParadaBus={initialParadaBus} direccionMetro={initialDireccionMetro}/>
      </footer>
    </div>
  );
}