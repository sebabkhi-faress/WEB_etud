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
      if (!timeSlots.includes(timeSlot)) {
        timeSlots.push(timeSlot)
      }
    })
    return timeSlots.sort()
  }
  // Group the schedule by day of the week (using jourId)
  const groupedSchedule = groupByDay(schedule)

  // Define time slots (you can adjust these to fit your needs)
  const timeSlots = extractTimeSlots(schedule)

  // Map jourId to Day names, skipping Friday (jourId 5)
  const dayMap = {
    0: "Saturday",
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Weekly Timetable</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-gray-300 w-1/6 text-center">
                Time
              </th>
              {Object.entries(dayMap).map(([dayId, dayName]) => (
                <th
                  key={dayId}
                  className="p-2 border border-gray-300 w-1/6 text-center"
                >
                  {dayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot: any) => (
              <tr key={slot}>
                <td className="p-2 border border-gray-300 text-center">
                  {slot}
                </td>
                {Object.keys(dayMap).map((dayId) => (
                  <td
                    key={dayId}
                    className="p-2 border border-gray-300 text-center"
                  >
                    {groupedSchedule[dayId]
                      .filter(
                        (seance: any) => seance.plageHoraireLibelleFr === slot,
                      )
                      .map((seance: any) => (
                        <div
                          key={seance.id}
                          className="text-sm flex justify-between"
                        >
                          <strong>{seance.matiere}</strong>
                          <span>{seance.ap}</span>
                        </div>
                      ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
