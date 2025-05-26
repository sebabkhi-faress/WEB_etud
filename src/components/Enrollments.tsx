"use client"

import { useState } from "react"
import {
  BanknotesIcon,
  MapIcon,
  PencilIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  CubeTransparentIcon,
  BookOpenIcon,
  SignalIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"

function Enrollments({ dias, currentYear }: any) {
  const [open, setOpen] = useState(currentYear)
  const dataSpanStyle =
    "block w-full bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      {/* Horizontal Tabs Navigation */}
      <div className="flex gap-4 p-6 bg-white border-b sticky top-0 z-10 overflow-x-auto shadow-sm scrollbar-hide">
        {dias.map((dia: any, index: number) => (
          <button
            key={index}
            onClick={() => setOpen(dia.anneeAcademiqueId)}
            className={`flex flex-shrink-0 items-center gap-3 px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 text-lg font-semibold ${
              open == dia.anneeAcademiqueId
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-sm px-3 py-1 rounded-full font-medium ${
                  currentYear == dia.anneeAcademiqueId
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {dia.anneeAcademiqueCode}
              </span>
              <span
                className={`text-sm px-3 py-1 rounded-full font-medium ${
                  dia.cycleCode == "M"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {dia.niveauCode}
              </span>
            </div>
            <span>
              {dia.ofLlSpecialite ? dia.ofLlSpecialite : dia.ofLlFiliere}
            </span>
          </button>
        ))}
      </div>

      {/* Content Panel */}
      {dias.map((dia: any, index: number) => (
        open == dia.anneeAcademiqueId && (
          <div
            key={index}
            className="flex-1 p-8"
          >
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  {/* Institution */}
                  <div className="flex flex-col gap-3">
                    <label className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
                      <BuildingOfficeIcon className="w-6 h-6 text-green-600" />
                      Institution:
                    </label>
                    <span className={dataSpanStyle}>
                      {dia.llEtablissementLatin}
                    </span>
                  </div>
                  {/* Domain */}
                  <div className="flex flex-col gap-3">
                    <label className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
                      <CubeTransparentIcon className="w-6 h-6 text-green-600" />
                      Domain:
                    </label>
                    <span className={dataSpanStyle}>{dia.ofLlDomaine}</span>
                  </div>
                  {/* Field */}
                  <div className="flex flex-col gap-3">
                    <label className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
                      <AcademicCapIcon className="w-6 h-6 text-green-600" />
                      Field:
                    </label>
                    <span className={dataSpanStyle}>{dia.ofLlFiliere}</span>
                  </div>
                  {/* Level */}
                  <div className="flex flex-col gap-3">
                    <label className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
                      <SignalIcon className="w-6 h-6 text-green-600" />
                      Level:
                    </label>
                    <span className={dataSpanStyle}>{dia.niveauLibelleLongLt}</span>
                  </div>
                  {/* Speciality */}
                  {dia.ofLlSpecialite && (
                    <div className="flex flex-col gap-3">
                      <label className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
                        <SparklesIcon className="w-6 h-6 text-green-600" />
                        Speciality:
                      </label>
                      <span className={dataSpanStyle}>{dia.ofLlSpecialite}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-10 p-6 bg-gray-50 rounded-xl">
                  <div className="flex gap-6">
                    <span
                      className={`group relative ${!dia.fraisInscriptionPaye && dia.anneeAcademiqueId == currentYear && "cursor-pointer"}`}
                      onClick={() =>
                        !dia.fraisInscriptionPaye &&
                        dia.anneeAcademiqueId == currentYear &&
                        window.open(
                          process.env.NEXT_PUBLIC_EPAIEMENT_INSCRIPTION,
                          "_blank",
                        )
                      }
                    >
                      <div className={`p-4 rounded-lg transition-all duration-300 ${
                        dia.fraisInscriptionPaye
                          ? "bg-green-100 text-green-600"
                          : `bg-red-100 text-red-600 ${dia.anneeAcademiqueId == currentYear && "hover:bg-green-100 hover:text-green-600"}`
                      }`}>
                        <BanknotesIcon className="w-7 h-7" />
                      </div>
                      <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
                        Inscription Fees {dia.fraisInscriptionPaye ? "Paid" : "Not Paid"}
                      </div>
                    </span>
                    <span
                      className={`group relative ${!dia.transportPaye && dia.anneeAcademiqueId == currentYear && "cursor-pointer"}`}
                      onClick={() =>
                        !dia.transportPaye &&
                        dia.anneeAcademiqueId == currentYear &&
                        window.open(
                          process.env.NEXT_PUBLIC_EPAIEMENT_TRANSPORT,
                          "_blank",
                        )
                      }
                    >
                      <div className={`p-4 rounded-lg transition-all duration-300 ${
                        dia.transportPaye
                          ? "bg-green-100 text-green-600"
                          : `bg-red-100 text-red-600 ${dia.anneeAcademiqueId == currentYear && "hover:bg-green-100 hover:text-green-600"}`
                      }`}>
                        <MapIcon className="w-7 h-7" />
                      </div>
                      <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
                        Transport Fees {dia.transportPaye ? "Paid" : "Not Paid"}
                      </div>
                    </span>
                  </div>
                  <Link
                    prefetch={false}
                    href={`/panel/${dia.id}`}
                    className="flex items-center gap-3 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold transition-all duration-300 hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    aria-label="Check Grades"
                  >
                    <PencilIcon className="w-6 h-6" aria-hidden="true" />
                    <span className="text-base">Check Grades</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  )
}

export default Enrollments
