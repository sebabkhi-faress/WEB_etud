"use client"

const UserGroup = ({ group }: { group: any[] }) => (
  <div className="w-full p-6">
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-green-400 to-green-600 text-white">
            <th className="py-4 px-6 text-left font-semibold text-sm md:text-base lg:text-lg">Semester</th>
            <th className="py-4 px-6 text-left font-semibold text-sm md:text-base lg:text-lg">Section</th>
            <th className="py-4 px-6 text-left font-semibold text-sm md:text-base lg:text-lg">Group</th>
          </tr>
        </thead>
        <tbody>
          {group.map((info, index) => (
            <tr 
              key={index} 
              className={`border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <td className="py-4 px-6 text-sm md:text-base lg:text-lg font-medium text-gray-800">
                {info.name}
              </td>
              <td className="py-4 px-6 text-sm md:text-base lg:text-lg text-gray-600">
                {info.section}
              </td>
              <td className="py-4 px-6 text-sm md:text-base lg:text-lg text-gray-600">
                {info.group}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default UserGroup
