"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export default function PanelButtons({ dias }: any) {
  const pathname = usePathname()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleClick = (id: string) => {
    setLoadingId(id) // Set the loading ID on click
  }

  // Effect to stop loading if the pathname matches loadingId
  useEffect(() => {
    const currentId = pathname.split("/")[2]
    if (loadingId && currentId === loadingId) {
      setLoadingId(null) // Reset loadingId if pathname matches
    }
  }, [pathname, loadingId]) // Effect runs on pathname or loadingId change

  return (
    <>
      {dias.map((dia: any, index: any) => (
        <Link
          prefetch={false}
          key={index}
          className={`rounded-lg px-4 py-2 text-lg md:text-2xl min-w-fit font-semibold transition ${
            pathname.split("/")[2] === dia.id.toString()
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800"
          } ${loadingId ? "opacity-60 cursor-not-allowed" : ""} ${loadingId === dia.id.toString() ? "bg-green-300/60" : ""}`}
          href={"/panel/" + dia.id.toString()}
          id={dia.id.toString()}
          onClick={(e) => {
            if (loadingId) {
              e.preventDefault() // Prevent navigation if loading
            } else {
              handleClick(dia.id.toString()) // Set loading state on click
            }
          }}
        >
          {loadingId === dia.id.toString() ? (
            <>Loading..</>
          ) : (
            dia.anneeAcademiqueCode
          )}
        </Link>
      ))}
    </>
  )
}
