const removeSpaces = (text: string) => text?.replace(/\s+/g, "")

export default function TimeTable({ schedule }: any) {
  const groupByDay = (schedule: any) => {
    const days = [0, 1, 2, 3, 4, 5]
    const grouped = {} as any

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
      if (!a || !b) return 0

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
  }

  return (
    <div className="container mx-auto pb-3 px-2 md:px-4 lg:px-8 capitalize">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-sm">
          <thead>
            <tr className="bg-gradient-to-r from-green-600 to-teal-500 text-white font-bold">
              <th className="p-1 md:p-2 lg:p-3 border border-gray-200 text-center text-xs md:text-sm lg:text-base">
                Time
              </th>
              {Object.entries(dayMap).map(([dayId, dayName]) => (
                <th
                  key={dayId}
                  className="p-1 md:p-2 lg:p-3 border border-gray-200 text-center text-xs md:text-sm lg:text-base"
                >
                  {dayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot: any) => {
              // Check if slot is null; if it is, return null (skip rendering)
              if (slot === null) return null

              return (
                <tr
                  key={slot}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="p-2 lg:p-3 border border-gray-300 text-center text-xs md:text-sm font-medium whitespace-nowrap bg-gray-50">
                    {removeSpaces(slot)}
                  </td>
                  {Object.keys(dayMap).map((dayId) => (
                    <td
                      key={dayId}
                      className="p-1 md:p-2 border border-gray-300 text-center text-xs md:text-sm"
                    >
                      {groupedSchedule[dayId]
                        .filter(
                          (seance: any) =>
                            seance.plageHoraireLibelleFr === slot,
                        )
                        .map((seance: any) => (
                          <div
                            key={seance.id}
                            className="flex flex-col items-center m-1 bg-white border border-gray-200 rounded shadow-sm p-1 hover:scale-105 transition transform duration-200"
                          >
                            <strong className="text-[10px] md:text-xs lg:text-sm text-gray-800">
                              {seance.matiere}
                            </strong>
                            <span className="text-[9px] md:text-xs lg:text-sm text-teal-600 font-semibold">
                              {seance.ap}
                            </span>
                          </div>
                        ))}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
