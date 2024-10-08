"use client"

// OrdinaryNotes: Tp/Td/Cm... Notes
function OrdinaryNotes({ item }: { item: any }) {
  return (
    <div
      className={`border border-gray-300 text-gray-800 rounded p-4 flex flex-col sm:flex-row justify-between items-center shadow-md transition duration-300 ease-in-out transform hover:scale-105 capitalize ${
        item.note == null
          ? "bg-gray-300/90"
          : item.note >= 10
            ? "bg-green-200 text-green-800"
            : "bg-red-200 text-red-900"
      }`}
      style={{ marginBottom: "0.5rem" }}
    >
      <p className="font-semibold" style={{ marginRight: "1rem" }}>
        {item.rattachementMcMcLibelleFr}
      </p>
      <div className="flex gap-4 mt-2 sm:mt-0">
        <p className="font-bold text-lg">
          {item.note == null ? "Empty" : item.note}
        </p>
        <p className="font-bold text-lg">{item.apCode}</p>
      </div>
    </div>
  )
}

export default OrdinaryNotes
