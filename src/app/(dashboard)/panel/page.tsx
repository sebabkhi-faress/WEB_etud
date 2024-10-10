import PanelButtons from "@/components/PanelButtons"
import { getDias } from "@/utils/api/panel"
import Link from "next/link"

export const metadata = {
  title: "WebEtu - Panel",
}

export default async function PanelPage() {
  const dias = await getDias()
  const currentYear = process.env.CURRENT_YEAR

  return (
    <div className="flex flex-1 flex-col gap-4 lg:mx-24 p-5">
      <h1 className="text-3xl font-bold">Enrollments:</h1>
      <PanelButtons dias={dias} currentYear={currentYear} />
    </div>
  )
}
