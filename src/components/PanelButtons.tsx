"use client"

import { ArrowLeftIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { usePathname } from "next/navigation"
useState

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { useState } from "react"

function PanelButtons({ dias, currentYear }: any) {
  const pathname = usePathname()
  const path = pathname.split("/")
  const selectedDia = dias.find((dia: any) => dia.id == path[2])

  return (
    <>
      <Menu>
        <MenuButton
          className={`rounded px-1 py-2 border hover:bg-gray-50/90 flex items-center text-xs md:text-sm bg-gray-50/90 border-green-500`}
        >
          <span
            className={`text-center m-1 p-1 lg:m-2 lg:p-2 border ${currentYear == selectedDia.anneeAcademiqueId ? "text-green-500 border-green-500" : "text-gray-500 border-gray-500"} rounded-full`}
          >
            {selectedDia.anneeAcademiqueCode}
          </span>
          <span
            className={`text-center m-1 p-1 lg:m-2 lg:p-2 border ${selectedDia.cycleCode == "M" ? "text-purple-500 border-purple-500" : "text-blue-500 border-blue-500"} rounded-full`}
          >
            {selectedDia.niveauCode}
          </span>
          <ChevronDownIcon className={`m-4 h-4 w-4`} />
        </MenuButton>
        <MenuItems
          anchor="bottom"
          className="w-[var(--button-width)] bg-gray-50 p-2 rounded border [--anchor-gap:4px] sm:[--anchor-gap:8px]"
        >
          {dias.map(
            (dia: any, index: any) =>
              dia.id !== selectedDia.id && (
                <>
                  <MenuItem key={index}>
                    <Link
                      prefetch={false}
                      href={`/panel/${dia.id}`}
                      key={index}
                      className={`rounded p-2 border hover:border-green-400 bg-gray-200 hover:bg-gray-50 flex text-xs md:text-sm ${path[2] == dia.id && "bg-gray-50/90 border-green-500"} mt-3`}
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
                  </MenuItem>
                </>
              ),
          )}
        </MenuItems>
      </Menu>

      <Link
        prefetch={false}
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
