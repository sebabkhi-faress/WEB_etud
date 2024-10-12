"use client"

function ExamNotes({ item }: { item: any }) {
  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-700 text-center">
          Normal Session
        </h3>
        {/* mt-2  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4 capitalize text-xs md:text-sm lg:text-lg">
          {item.normal.map((course: any) => (
            <div
              className={`rounded p-4 lg:p-6 shadow-md transition transform flex hover:scale-105 border border-gray-300 ${
                course.noteExamen == null
                  ? "bg-gray-300/90 text-gray-800"
                  : course.noteExamen >= 10
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
              }`}
              key={course.id}
            >
              <h4 className="font-semibold flex-1">{course.mcLibelleFr}</h4>
              <p className="font-bold">
                {course.noteExamen != null ? course.noteExamen : "Null"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {item.rattrappage.length > 0 && (
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-700 text-center">
            Rattrappage Session
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4 capitalize text-xs md:text-sm lg:text-lg">
            {item.rattrappage.map((course: any) => (
              <div
                className={`rounded p-4 lg:p-6 shadow-md transition transform flex hover:scale-105 border border-gray-300 ${
                  course.noteExamen == null
                    ? "bg-gray-300/90 text-gray-800"
                    : course.noteExamen >= 10
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                }`}
                key={course.id}
              >
                <h4 className="font-semibold flex-1">{course.mcLibelleFr}</h4>
                <p className="font-bold">
                  {course.noteExamen == null ? "Empty" : course.noteExamen}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default ExamNotes
