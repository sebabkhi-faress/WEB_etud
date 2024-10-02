"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function PanelButtons({ dias }: any) {
  const pathname = usePathname()

  return dias.map((dia: any, index: any) => (
    <Link
      prefetch={false}
      key={index}
      className={`rounded-lg px-4 py-2 text-lg md:text-2xl min-w-fit font-semibold transition ${
        pathname.split("/")[2] === dia.id.toString()
          ? "bg-green-600 text-white"
          : "bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700"
      }`}
      href={"/panel/" + dia.id.toString()}
      id={dia.id.toString()}
    >
      {dia.anneeAcademiqueCode}
    </Link>
  ))
}
