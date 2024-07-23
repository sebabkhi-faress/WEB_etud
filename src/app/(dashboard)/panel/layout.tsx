import { getDias } from "@/api"
import Link from "next/link"

export const metadata = {
  title: "WebEtu - Panel",
}

export default async function PanelPage({
  children,
}: {
  children: React.ReactNode
}) {
  const dias = await getDias();
  
  return (
    <div className="flex flex-col md:flex-row p-4 w-full min-h-screen">
      <div className="flex flex-row md:flex-col gap-2 justify-start md:mb-0 overflow-x-auto md:overflow-x-visible">
        {dias.map((dia: any, index: any) => (
          <Link
            key={index}
            className="rounded-lg px-4 py-2 text-lg md:text-2xl min-w-fit font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700 disabled:bg-slate-400 disabled:text-white"
            href={"/panel/" + dia.id.toString()}
            id={dia.id.toString()}
          >
            {dia.anneeAcademiqueCode}
          </Link>
        ))}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-4 justify-center items-center p-4">
          {children}
        </div>
      </div>

    </div>
  )
}
