import PanelButtons from "@/components/PanelButtons"
import { getDias } from "@/utils/api/panel"
import Link from "next/link"

export const metadata = {
  title: "WebEtu - Panel",
}

export default async function PanelPage({
  children,
}: {
  children: React.ReactNode
}) {
  const dias = await getDias()

  return (
    <div className="flex flex-col md:flex-row p-4 w-full min-h-screen">
      <div className="flex flex-row md:flex-col gap-2 justify-start md:mb-0 overflow-x-auto md:overflow-x-visible">
        <PanelButtons dias={dias} />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-4 justify-center items-center p-4 md:pt-0">
          {children}
        </div>
      </div>
    </div>
  )
}
