"use client"

const UserGroup = ({ group }: { group: any }) => (
  <div className="bg-gray-200 border border-gray-300 w-full p-6 rounded shadow-md grid gap-8 grid-cols-1 md:grid-cols-2">
    {Object.entries(group).map(([semester, info]: any, index) => (
      <div key={index} className="p-2 space-y-2">
        <h2 className="w-full md:text-lg lg:text-xl rounded py-4 px-6 text-center bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md">
          {semester}
        </h2>
        <div className="border border-gray-300 bg-white rounded p-4 shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl space-y-2 lg:space-y-4 font-semibold text-gray-800 text-sm md:text-base lg:text-lg capitalize">
          <p>
            <span className="font-bold">Section:</span> {info.section}
          </p>
          <p>
            <span className="font-bold">Group:</span> {info.group}
          </p>
        </div>
      </div>
    ))}
  </div>
)

export default UserGroup
