"use client"

function ErrorComponent({ error }: { error: string }) {
  return (
    <div className="flex items-center justify-center flex-1 bg-gray-100 px-4 sm:px-6">
      <div className="rounded shadow-lg p-4 sm:p-6 max-w-md w-full text-center bg-gray-200 border border-red-700">
        <h1 className="text-xl sm:text-2xl font-semibold text-red-600 mb-3 sm:mb-4">
          Error
        </h1>
        <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
          aria-label="Refresh Page"
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}

export default ErrorComponent
