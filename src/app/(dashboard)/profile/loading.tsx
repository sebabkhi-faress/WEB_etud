import { ArrowPathIcon } from "@heroicons/react/24/outline"
export default function ProfileLoading() {
  return (
    <div className="animate-loading bg-gray-200 border items-center border-gray-400 w-full h-max max-w-3xl m-5 p-7 flex flex-col gap-8 rounded shadow-5x5 box-border">
      <ArrowPathIcon className="animate-spin h-16 w-16 m-5" />
    </div>
  )
}
