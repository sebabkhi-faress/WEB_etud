"use client"

interface Module {
  id: number
  mcLibelleFr: string
  noteExamen: number | null
}

interface ExamNotesProps {
  item: {
    normal: Module[]
    rattrappage: Module[]
  }
}

const headerStyle =
  "text-xl md:text-3xl font-bold text-gray-800 mb-6 border-b-2 border-green-600 pb-2 inline-block"
const itemDivStyle =
  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
const moduleDivStyle =
  "rounded-lg p-5 shadow-sm border transition transform flex justify-between items-center hover:shadow-md"

function getNoteClass(note: number | null) {
  if (note === null) return "bg-gray-100 text-gray-700 border-gray-200"
  return note >= 10 ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
}

function ModuleCard({ module }: { module: Module }) {
  return (
    <div
      className={`${moduleDivStyle} ${getNoteClass(module.noteExamen)}`}
      key={module.id}
    >
      <h4 className="font-semibold text-base md:text-lg flex-1 pr-4 overflow-hidden text-ellipsis whitespace-nowrap">
        {module.mcLibelleFr}
      </h4>
      <p className="font-bold text-base md:text-lg flex-shrink-0">
        {module.noteExamen !== null && module.noteExamen !== undefined
          ? module.noteExamen
          : "N/A"}
      </p>
    </div>
  )
}

function ExamNotes({ item }: ExamNotesProps) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-inner">
      <div className="mb-8">
        <h3 className={headerStyle}>Normal Session</h3>
        <div className={itemDivStyle}>
          {item.normal.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>

      {item.rattrappage.length > 0 && (
        <div>
          <h3 className={`${headerStyle}`}>Rattrapage Session</h3>
          <div className={itemDivStyle}>
            {item.rattrappage.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamNotes
