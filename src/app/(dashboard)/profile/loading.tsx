import { ArrowPathIcon } from "@heroicons/react/24/outline"
export default function ProfileLoading() {
  return (
    <div className="animate-loading border border-green-700 lg:w-full max-w-3xl flex justify-center items-center rounded shadow-2xl absolute top-5 bottom-5 right-5 left-5 lg:left-auto lg:right-auto">
      <ArrowPathIcon className="animate-spin h-16 w-16 m-5" />
    </div>
  )
}
