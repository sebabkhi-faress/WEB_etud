"use client"

import { useState } from "react"

function PanelButtons({ dias }: any) {
  const currentYear = process.env.CURRENT_YEAR

  const [open, setOpen] = useState(currentYear)

  return (
    <>
      {dias.map((dia: any, index: any) => (
        <button
          type="button"
          onClick={() => setOpen(dia.anneeAcademiqueId)}
          key={index}
          className="rounded p-4 border hover:bg-gray-50/90 transition-all duration-1000"
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-center m-1 p-1 lg:m-2 lg:p-2 text-xs lg:text-sm border ${currentYear == dia.anneeAcademiqueId ? "text-green-500 border-green-500" : "text-yellow-500 border-yellow-500"} rounded-full`}
            >
              {dia.anneeAcademiqueCode}
            </span>
            <span className="flex-1 text-sm lg:text-lg font-bold text-left">
              {dia.ofLlSpecialite ? dia.ofLlSpecialite : dia.ofLlFiliere}
            </span>
            <span
              className={`text-center m-1 p-1 lg:m-2 lg:p-2 text-xs lg:text-sm border ${dia.cycleCode == "M" ? "text-purple-500 border-purple-500" : "text-blue-500 border-blue-500"} rounded-full`}
            >
              {dia.niveauCode}
            </span>
          </div>

          {open == dia.anneeAcademiqueId && <div>hidden content</div>}
        </button>
      ))}
    </>
  )
}

export default PanelButtons
