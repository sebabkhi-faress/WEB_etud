"use client"

import { useState } from "react"
import { BanknotesIcon, MapIcon, PencilIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

function Enrollments({ dias, currentYear }: any) {
  const [open, setOpen] = useState(currentYear)

  return (
    <>
      {dias.map((dia: any, index: any) => (
        <div
          key={index}
          className={`rounded p-4 border hover:bg-gray-50/90 ${open == dia.anneeAcademiqueId ? "bg-gray-50/90 border-green-500" : ""}`}
        >
          <div
            onClick={() => setOpen(dia.anneeAcademiqueId)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="flex flex-col lg:flex-row text-xs md:text-sm">
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
            </div>
            <span className="flex-1 text-sm md:text-base lg:text-lg font-bold text-left">
              {dia.ofLlSpecialite ? dia.ofLlSpecialite : dia.ofLlFiliere}
            </span>
          </div>

          {open == dia.anneeAcademiqueId && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 text-xs md:text-sm">
              <div className="flex flex-col gap-2 text-left">
                <label className="font-bold">Instutution:</label>
                <span className="bg-gray-200 p-4 rounded">
                  {dia.llEtablissementLatin}
                </span>
              </div>
              <div className="flex flex-col gap-2 text-left">
                <label className="font-bold">Domain:</label>
                <span className="bg-gray-200 p-4 rounded">
                  {dia.ofLlDomaine}
                </span>
              </div>
              <div className="flex flex-col gap-2 text-left">
                <label className="font-bold">Feild:</label>
                <span className="bg-gray-200 p-4 rounded">
                  {dia.ofLlFiliere}
                </span>
              </div>
              <div className="flex flex-col gap-2 text-left h-full">
                <label className="font-bold">Level:</label>
                <span className="bg-gray-200 p-4 rounded">
                  {dia.niveauLibelleLongLt}
                </span>
              </div>
              {dia.ofLlSpecialite && (
                <div className="flex flex-col gap-2 text-left">
                  <label className="font-bold">Speciality:</label>
                  <span className="bg-gray-200 p-4 rounded">
                    {dia.ofLlSpecialite}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center p-4 lg:col-span-2">
                <div className="flex gap-2 text-left">
                  <span className="group relative">
                    <BanknotesIcon
                      className={`w-6 h-6 lg:w-8 lg:h-8 ${dia.fraisInscriptionPaye ? "text-yellow-500" : "text-gray-400"}`}
                    />
                    <div className="hidden group-hover:block absolute min-w-fit p-2 bg-gray-200 rounded text-xs">
                      inscription fees{" "}
                      {dia.fraisInscriptionPaye ? "payed" : "not payed"}
                    </div>
                  </span>
                  <span className="group relative">
                    <MapIcon
                      className={`w-6 h-6 lg:w-8 lg:h-8 ${dia.transportPaye ? "text-yellow-500" : "text-gray-400"}`}
                    />
                    <div className="hidden group-hover:block absolute min-w-fit p-2 bg-gray-200 rounded text-xs">
                      transport fees{" "}
                      {dia.fraisInscriptionPaye ? "payed" : "not payed"}
                    </div>
                  </span>
                </div>
                <Link
                  href={`/panel/${dia.id}`}
                  className="flex p-2 gap-2 bg-green-600 text-white rounded font-bold"
                >
                  <PencilIcon className="w-4 h-4 lg:w-6 lg:h-6" />
                  check Grades
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  )
}

export default Enrollments
