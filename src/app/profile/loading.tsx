import { ArrowPathIcon } from "@heroicons/react/24/outline"

export default function ProfileLoadingPage() {
  return (
    <div className="bg-gray-200 w-full max-w-3xl min-h-screen mx-4 md:mx-auto mt-6 p-6 mb-5 md:p-8 border border-gray-300 rounded flex items-center justify-center animate-bg-pulse">
      <ArrowPathIcon className="animate-spin h-16 w-16" />
    </div>
  )
}
