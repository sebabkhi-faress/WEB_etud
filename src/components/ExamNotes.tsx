"use client"

function ExamNotes({ item }: { item: any }) {
  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-700 text-center">
          Normal Session
        </h3>
        <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 capitalize">
          {item.normal.map((course: any) => (
            <div
              className={`text-gray-800 rounded p-4 shadow-md transition transform hover:scale-105 border border-gray-300 ${
                course.noteExamen == null
                  ? "bg-gray-300/90"
                  : course.noteExamen >= 10
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
              }`}
              key={course.id}
            >
              <h4 className="font-semibold">{course.mcLibelleFr}</h4>
              <p className="font-bold text-lg">
                {course.noteExamen != null ? course.noteExamen : "Null"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {item.rattrappage.length > 0 && (
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-700 text-center m-1 mb-4">
            Rattrappage Session
          </h3>
          <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 capitalize">
            {item.rattrappage.map((course: any) => (
              <div
                className={`rounded p-4 shadow-md transition transform hover:scale-105 border border-gray-300 ${
                  course.noteExamen == null
                    ? "bg-gray-300/90"
                    : course.noteExamen >= 10
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                }`}
                key={course.id}
              >
                <h4 className="font-semibold">{course.mcLibelleFr}</h4>
                <p className="font-bold text-gray-800 text-lg">
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
