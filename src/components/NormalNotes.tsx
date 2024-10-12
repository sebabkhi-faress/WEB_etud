"use client"

function NormalNotes({ normal }: { normal: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4">
      {normal.map((note: any, index: number) => (
        <div
          key={index}
          className={`border border-gray-300 text-gray-800 rounded p-4 lg:p-6  text-xs md:text-sm lg:text-lg flex justify-between items-center shadow-md w-full transition duration-300 ease-in-out transform hover:scale-105 capitalize ${
            note.note == null
              ? "bg-gray-300/90"
              : note.note >= 10
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-900"
          }`}
          style={{ marginBottom: "0.5rem" }}
        >
          <p className="font-semibold" style={{ marginRight: "1rem" }}>
            {note.rattachementMcMcLibelleFr}
          </p>
          <div className="flex gap-4">
            <p className="font-bold">
              {note.note == null ? "Empty" : note.note}
            </p>
            <p className="font-bold">{note.apCode}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NormalNotes
