export default function TimeTable({ schedule }: any) {
  const betterSlotFormat = (text: string) => {
    return text
      ?.replace(/\s+/g, "") // Remove all spaces
      .replace(/-/g, " - ") // Add spaces around dashes
  }

  const groupByDay = (schedule: any) => {
    const days = [0, 1, 2, 3, 4, 5]
    const grouped: Record<any, any[]> = {}

    days.forEach((dayId: any) => {
      grouped[dayId] = schedule.filter((seance: any) => seance.jourId === dayId)
    })

    return grouped
  }

  const extractTimeSlots = (schedule: { plageHoraireLibelleFr: string }[]) => {
    const timeSlots: string[] = []

    schedule.forEach((seance) => {
      const timeSlot = seance.plageHoraireLibelleFr

      if (!timeSlots?.includes(timeSlot)) {
        timeSlots.push(timeSlot)
      }
    })

    // Sort the time slots correctly
    timeSlots.sort((a, b) => {
      if (!a) return 1 // Put nulls at the end
      if (!b) return -1 // Put nulls at the end

      const [startA] = a.split("-").map((time) => time.split(":").map(Number))
      const [startB] = b.split("-").map((time) => time.split(":").map(Number))

      // Compare hours first, then minutes
      return startA[0] - startB[0] || startA[1] - startB[1]
    })

    return timeSlots
  }

  const groupedSchedule = groupByDay(schedule)
  const timeSlots = extractTimeSlots(schedule)

  const dayMap = {
    0: "Saturday",
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
  } as Record<any, string>

  // 'True' only if 'groupedSchedule' equals: { '0': [], '1': [], '2': [], '3': [], '4': [], '5': [] }
  const daysEmpty = Object.values(groupedSchedule).every(
    (array) => array.length === 0,
  )

  // 'True' only if 'timeSlots' equals: [ null ]
  const hoursEmpty = timeSlots.length === 1 && timeSlots[0] === null

  if (daysEmpty || hoursEmpty) {
    return (
      <p className="text-center mb-3 text-red-700 text-sm sm:text-lg">
        Data Not Available!
      </p>
    )
  }

  return (
    <div className="container mx-auto capitalize">
      {/* Large Screens View */}
      <div className="overflow-x-auto hidden lg:block mb-2">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gradient-to-r from-green-600 to-teal-500 text-white font-bold">
              <th className="p-2 border border-gray-200 text-center text-xs text-base">
                Time
              </th>
              {Object.entries(dayMap).map(([dayId, dayName]) => (
                <th
                  key={dayId}
                  className="p-2 border border-gray-200 text-center text-xs text-base"
                >
                  {dayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot: any) => {
              return (
                slot && (
                  <tr
                    key={slot}
                    className="hover:bg-gray-100 transition duration-200"
                  >
                    <td className="p-3 border border-gray-300 text-center text-xs font-medium whitespace-nowrap bg-gray-50">
                      {betterSlotFormat(slot)}
                    </td>
                    {Object.keys(dayMap).map((dayId) => (
                      <td
                        key={dayId}
                        className="p-2 border border-gray-300 text-center text-xs"
                      >
                        {groupedSchedule[dayId]
                          .filter(
                            (seance: any) =>
                              seance.plageHoraireLibelleFr === slot,
                          )
                          .map((seance: any) => (
                            <div
                              key={seance.id}
                              className="flex flex-col items-center m-1 bg-white border border-gray-200 rounded p-1 hover:scale-103 transition transform duration-200"
                            >
                              <strong className="text-sm text-gray-800">
                                {seance.matiere}
                              </strong>
                              <span className="text-sm text-teal-600 font-semibold">
                                {seance.ap}
                              </span>
                              <span className="text-[10px] text-purple-600 font-semibold">
                                {seance.refLieuDesignation}
                              </span>
                            </div>
                          ))}
                      </td>
                    ))}
                  </tr>
                )
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Small Screens View */}
      <div className="lg:hidden space-y-4 mb-2">
        {Object.entries(groupedSchedule).map(([dayId, sessions]) => {
          return (
            sessions.length > 0 && (
              <div
                key={dayId}
                className="border border-gray-300 rounded p-6 bg-green-200/60"
              >
                <h3 className="text-lg font-bold text-black mb-3 text-center">
                  {dayMap[dayId]}
                </h3>
                {timeSlots.map((slot) => {
                  const associatedSessions = sessions.filter(
                    (seance: any) => seance.plageHoraireLibelleFr === slot,
                  )

                  return (
                    associatedSessions.length > 0 && (
                      <div key={slot} className="mb-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1 text-center">
                          {betterSlotFormat(slot)}
                        </h4>
                        {associatedSessions.map((seance: any) => (
                          <div
                            key={seance.id}
                            className="flex flex-col items-start bg-white border border-gray-400/70 rounded p-3 mb-2 transition-transform transform hover:scale-103"
                          >
                            <strong className="text-xs text-gray-800 mb-1">
                              {seance.matiere}
                            </strong>
                            <span className="text-xs text-teal-600 font-semibold">
                              {seance.ap}
                            </span>
                            <span className="text-xs text-purple-600">
                              {seance.refLieuDesignation}
                            </span>
                          </div>
                        ))}
                      </div>
                    )
                  )
                })}
              </div>
            )
          )
        })}
      </div>
    </div>
  )
}
