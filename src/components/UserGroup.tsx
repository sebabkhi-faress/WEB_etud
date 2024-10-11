"use client"

const UserGroup = ({ group }: { group: any }) => (
  <div className="bg-gray-200 border border-gray-300 w-full max-w-7xl mx-auto p-8 rounded shadow-md overflow-x-auto">
    <div
      className={`grid gap-8 ${
        Object.keys(group).length === 1
          ? "grid-cols-1"
          : "grid-cols-1 md:grid-cols-2"
      }`}
    >
      {Object.entries(group).map(([semester, info]: any, index) => (
        <div key={index} className="p-4">
          <h2 className="w-full text-xl rounded py-4 px-6 text-center bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md">
            {semester}
          </h2>
          <div className="border border-gray-300 bg-white rounded p-6 mt-4 shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl capitalize">
            <p className="mb-4 text-md text-gray-700">
              <span className="font-semibold text-gray-800">Section:</span>{" "}
              {info.section}
            </p>
            <p className="mb-4 text-md text-gray-700">
              <span className="font-semibold text-gray-800">Group:</span>{" "}
              {info.group}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default UserGroup
