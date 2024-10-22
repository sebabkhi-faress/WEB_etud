import PanelButtons from "@/components/PanelButtons"
import PanelYearTitle from "@/components/PanelYearTitle"
import { getDias } from "@/utils/api/panel"

export const metadata = {
  title: "WebEtu - Panel",
}

export default async function PanelPage({
  children,
}: {
  children: React.ReactNode
}) {
  const dias = await getDias()
  const currentYear = process.env.CURRENT_YEAR

  return (
    <div className="flex flex-col md:flex-row p-4 w-full min-h-screen">
      <div className="flex flex-row md:flex-col gap-2 justify-start md:mb-0 overflow-x-auto md:overflow-x-visible">
        <PanelButtons dias={dias} currentYear={currentYear} />
      </div>

      <div className="flex flex-1 items-center flex-col mt-4 md:mt-0">
        <PanelYearTitle dias={dias} />
        {children}
      </div>
    </div>
  )
}
