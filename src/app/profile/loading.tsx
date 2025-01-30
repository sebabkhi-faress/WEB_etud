export default function ProfileLoadingPage() {
  return (
    <div className="bg-gray-200/60 mx-4 md:mx-auto mt-6 p-6 md:p-8 rounded border border-green-700 capitalize mb-5 animate-pulse">
      {/* Profile Image and Logo Placeholder */}
      <div className="flex flex-row items-center justify-center gap-12 mb-6">
        <div className="mr-8 md:mr-96">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 border border-green-700"></div>
        </div>
        <div>
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* Profile Details Placeholder */}
      <ul className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <li
            key={index}
            className="flex flex-col justify-start items-start text-sm md:text-lg gap-2"
          >
            <span className="font-bold text-gray-600 bg-gray-300 h-4 w-24 rounded"></span>
            <span className="text-gray-800 p-3 sm:p-4 bg-white rounded w-full border border-green-700 h-10"></span>
          </li>
        ))}
      </ul>
    </div>
  )
}
