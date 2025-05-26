interface ModuleNote {
  rattachementMcMcLibelleFr: string
  note: number | null
  apCode: string
}

interface NormalNotesProps {
  normal: ModuleNote[]
}

function getNoteClass(noteValue: number | null): string {
  if (noteValue == null) {
    return "bg-gray-100 text-gray-700 border-gray-200"
  }
  return noteValue >= 10
    ? "bg-green-50 border-green-200 text-green-800"
    : "bg-red-50 border-red-200 text-red-800"
}

function getApCodeClass(apCode: string): string {
  switch (apCode) {
    case 'TD':
      return 'bg-yellow-200 text-yellow-800';
    case 'TP':
      return 'bg-blue-200 text-blue-800';
    default:
      return 'bg-gray-200 text-gray-700';
  }
}

function NormalNotes({ normal }: NormalNotesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {normal.map((note, index) => {
        const { rattachementMcMcLibelleFr, note: noteValue, apCode } = note

        const noteClass = getNoteClass(noteValue)
        const apCodeClass = getApCodeClass(apCode);

        return (
          <div
            key={index}
            className={`rounded-lg p-5 shadow-sm border transition transform flex justify-between items-center w-full hover:shadow-md ${
              noteClass
            }`}
          >
            <h4 className="font-semibold text-base md:text-lg flex-1 pr-4 overflow-hidden text-ellipsis whitespace-nowrap">
              {rattachementMcMcLibelleFr}
            </h4>
            <div className="flex items-center gap-4 ml-2 flex-shrink-0">
              <p className="font-bold text-base md:text-lg text-gray-700">
                {noteValue == null ? "N/A" : Math.floor(noteValue * 100) / 100}
              </p>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${apCodeClass}`}>
                {apCode}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default NormalNotes
