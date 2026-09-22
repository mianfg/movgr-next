import Favicon from "@/app/favicon.svg";
import { ModeToggle } from "@/components/common/ModeToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad · movGR",
  description:
    "Cómo movGR trata los datos en la web y en la app de iOS: ubicación, analítica, almacenamiento local y derechos.",
};

export default function PrivacyPage() {
  return (
    <div className="h-[100dvh] overflow-y-auto overscroll-y-contain">
      <div className="mx-auto flex w-full max-w-[640px] flex-col px-4 pb-16 pt-4">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src={Favicon} alt="movGR" className="h-8 w-8 dark:invert" />
            <div className="-mt-[5px]">
              <span className="text-[24px] font-normal">mov</span>
              <span className="text-[18px] font-bold tracking-wide">GR</span>
            </div>
          </Link>
          <ModeToggle />
        </header>

        <article className="space-y-6 text-sm leading-relaxed text-foreground">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Política de privacidad</h1>
            <p className="text-muted-foreground">Última actualización: 22 de septiembre de 2026</p>
          </div>

          <p>
            Esta política describe cómo <strong>movGR</strong> trata la información en el sitio web{" "}
            <a className="underline underline-offset-2" href="https://movgr.mianfg.me">https://movgr.mianfg.me</a>{" "}
            y en la aplicación de iOS. movGR es un proyecto personal, gratuito y de código abierto, sin cuentas de usuario y sin publicidad.
          </p>
          <p>
            Responsable: Miguel Ángel Fernández Gutiérrez (mianfg). Contacto:{" "}
            <a className="underline underline-offset-2" href="mailto:hello@mianfg.me">hello@mianfg.me</a>.
          </p>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Qué no hacemos</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>No creamos cuentas ni pedimos correo, nombre o teléfono para usar el servicio.</li>
              <li>No vendemos datos ni mostramos anuncios.</li>
              <li>No hacemos seguimiento publicitario ni elaboramos perfiles comerciales.</li>
              <li>No combinamos tu actividad con identificadores de publicidad.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Datos que se quedan en tu dispositivo</h2>
            <p>
              Preferencias como paradas favoritas, parada o estación reciente, sentido del metro, orden de la búsqueda y tema (claro, oscuro o sistema) se guardan en el propio dispositivo: <em>localStorage</em> en la web y ajustes locales en iOS.
            </p>
            <p>
              Esa información no se envía a un perfil de usuario. Si desinstalas la app o borras los datos del navegador, desaparece.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Ubicación (solo iOS, opcional)</h2>
            <p>
              La app de iOS puede usar la ubicación <strong>mientras la usas</strong> para situarte en el mapa y mostrar paradas cercanas. El permiso es opcional: si lo deniegas, el resto de funciones sigue disponible.
            </p>
            <p>
              La ubicación precisa se usa solo para esa función. No se usa para seguimiento, no se asocia a una cuenta y no se comparte con anunciantes. Los datos de transporte que pedimos a la API son identificadores de parada o línea, no tu posición continua.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Consultas de transporte</h2>
            <p>
              Al consultar llegadas, la web y la app piden a{" "}
              <a className="underline underline-offset-2" href="https://movgr.apis.mianfg.me">https://movgr.apis.mianfg.me</a>{" "}
              información de paradas, líneas y tiempos. Esas peticiones pueden incluir el identificador de la parada o línea que has elegido y datos técnicos habituales de red (por ejemplo, dirección IP vista por el servidor).
            </p>
            <p>
              No usamos esas peticiones para identificarte como persona. Los registros técnicos del servidor, si existen, se limitan a operar y depurar el servicio.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Live Activities y mapa (iOS)</h2>
            <p>
              Si activas Live Activities, las próximas llegadas pueden mostrarse en la pantalla de bloqueo, en Dynamic Island y, si tienes un Apple Watch emparejado, en la pila inteligente. Ese contenido lo gestiona el sistema de Apple a partir de lo que calcula la app.
            </p>
            <p>
              El mapa nativo usa MapKit de Apple. No usamos Google Maps en iOS.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Analítica de la web</h2>
            <p>
              El sitio web puede usar <strong>Umami</strong>, una herramienta de analítica pensada para privacidad. Recoge estadísticas agregadas y anónimas (páginas vistas, tipo de dispositivo, país o ciudad de forma general, origen de la visita). No usa cookies de seguimiento y no almacena direcciones IP para identificarte.
            </p>
            <p>
              La app de iOS no incluye Umami.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Cookies y tema en la web</h2>
            <p>
              En la web puede guardarse la preferencia de tema (claro, oscuro o sistema) para recordarla entre visitas. No se usa para rastrearte.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Terceros</h2>
            <p>Pueden intervenir, en la medida en que uses sus plataformas:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Apple (App Store, iOS, MapKit, Live Activities, Watch).</li>
              <li>Umami, solo en la web, para analítica agregada.</li>
              <li>El alojamiento de la web y de la API.</li>
            </ul>
            <p>
              El transporte público de Granada es información de servicio; movGR no es un servicio oficial del Ayuntamiento ni de los operadores.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Menores</h2>
            <p>
              movGR no está dirigido a recabar datos de menores. No hay registro. Si un menor usa la app, las mismas reglas de ubicación opcional y almacenamiento local se aplican.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Tus derechos</h2>
            <p>
              Como no mantenemos una cuenta ni un fichero de clientes, no hay un perfil que descargar o borrar en nuestros servidores. Puedes:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>revocar la ubicación en Ajustes del iPhone;</li>
              <li>borrar favoritos y preferencias en la app o en el navegador;</li>
              <li>desinstalar la app o dejar de usar la web.</li>
            </ul>
            <p>
              Si tienes una pregunta sobre privacidad, escribe a{" "}
              <a className="underline underline-offset-2" href="mailto:hello@mianfg.me">hello@mianfg.me</a>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Cambios</h2>
            <p>
              Si esta política cambia de forma relevante, actualizaremos la fecha del principio de esta página.
            </p>
          </section>
        </article>

        <div className="mt-10">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeftIcon />
              Volver a movGR
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
