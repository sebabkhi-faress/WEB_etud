export default function TimeTable({ schedule }: any) {
  const groupByDay = (schedule: any) => {
    const days = [0, 1, 2, 3, 4, 5];
    const grouped = {} as any;

    days.forEach((dayId: any) => {
      grouped[dayId] = schedule.filter((seance: any) => seance.jourId === dayId);
    });

    return grouped;
  };

  const extractTimeSlots = (schedule: { plageHoraireLibelleFr: string }[]) => {
    const timeSlots: string[] = [];
    schedule.forEach((seance) => {
      const timeSlot = seance.plageHoraireLibelleFr;
      if (!timeSlots.includes(timeSlot)) {
        timeSlots.push(timeSlot);
      }
    });
    return timeSlots.sort();
  };

  const groupedSchedule = groupByDay(schedule);
  const timeSlots = extractTimeSlots(schedule);

  const dayMap = {
    0: "Saturday",
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
  };

  return (
    <div className="container mx-auto p-4 capitalize">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-sm">
          <thead>
            <tr className="bg-gradient-to-r from-green-600 to-teal-500 text-white font-bold">
              <th className="p-2 border border-gray-200 text-center text-xs">
                Time
              </th>
              {Object.entries(dayMap).map(([dayId, dayName]) => (
                <th
                  key={dayId}
                  className="p-2 border border-gray-200 text-center text-xs"
                >
                  {dayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot: any) => (
              <tr key={slot} className="hover:bg-gray-100 transition duration-200">
                <td className="p-2 border border-gray-300 text-center text-xs font-medium whitespace-nowrap bg-gray-50">
                  {slot}
                </td>
                {Object.keys(dayMap).map((dayId) => (
                  <td
                    key={dayId}
                    className="p-1 border border-gray-300 text-center text-xs"
                  >
                    {groupedSchedule[dayId]
                      .filter(
                        (seance: any) => seance.plageHoraireLibelleFr === slot
                      )
                      .map((seance: any) => (
                        <div
                          key={seance.id}
                          className="text-sm flex flex-col justify-center items-center m-1 bg-white border border-gray-200 rounded-sm shadow-sm p-1"
                        >
                          <strong className="text-xs text-gray-800">{seance.matiere}</strong>
                          <span className="text-xs text-teal-600">{seance.ap}</span>
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
  );
}
