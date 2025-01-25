import { ArrowPathIcon } from "@heroicons/react/24/outline"

export default function PanelLoadingPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <ArrowPathIcon className="animate-spin h-16 w-16 m-5" />
    </div>
  )
}
