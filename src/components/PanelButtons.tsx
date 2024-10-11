"use client"

import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { usePathname } from "next/navigation"

function PanelButtons({ dias, currentYear }: any) {
  const pathname = usePathname()
  const path = pathname.split("/")
  return (
    <>
      {dias.map((dia: any, index: any) => (
        <Link
          href={`/panel/${dia.id}`}
          key={index}
          className={`rounded p-2 border hover:bg-gray-50/90  flex-col lg:flex-row text-xs md:text-sm hidden md:flex ${path[2] == dia.id && "bg-gray-50/90 border-green-500"}`}
        >
          <span
            className={`text-center m-1 p-1 lg:m-2 lg:p-2 border ${currentYear == dia.anneeAcademiqueId ? "text-green-500 border-green-500" : "text-gray-500 border-gray-500"} rounded-full`}
          >
            {dia.anneeAcademiqueCode}
          </span>
          <span
            className={`text-center m-1 p-1 lg:m-2 lg:p-2 border ${dia.cycleCode == "M" ? "text-purple-500 border-purple-500" : "text-blue-500 border-blue-500"} rounded-full`}
          >
            {dia.niveauCode}
          </span>
        </Link>
      ))}
      <Link
        href={`/panel`}
        className={`rounded px-4 py-4 border border-red-400 hover:border-red-400 md:border-gray-200 text-red-700 hover:bg-gray-50/90 flex items-center text-sm md:text-base gap-2`}
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Enrollments
      </Link>
    </>
  )
}

export default PanelButtons
