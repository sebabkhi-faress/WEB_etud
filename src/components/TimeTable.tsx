"use client"

import { useRef } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface Session {
  id: string
  jourId: number
  plageHoraireLibelleFr: string
  matiere: string
  ap: string
  refLieuDesignation: string
}

interface CellHookData {
  cell: {
    text: string[] | string | number | null
    styles?: any
  }
  column: {
    index: number
  }
  row: {
    index: number
  }
  table: {
    body: any[]
    head: any[]
  }
}

interface AutoTableData {
  pageCount: number
  settings: {
    margin: {
      left: number
    }
  }
}

interface AutoTableOptions {
  startY: number
  head: string[][]
  body: string[][]
  theme: string
  styles: {
    fontSize: number
    cellPadding: number
    lineColor: number[]
    lineWidth: number
  }
  headStyles: {
    fillColor: number[]
    textColor: number[]
    fontSize: number
    fontStyle: string
    halign: string
  }
  columnStyles: {
    [key: number]: {
      cellWidth: number | string
    }
  }
  didDrawPage: (data: AutoTableData) => void
}

interface TableCellData {
  cell: {
    text: string | number | null
  }
}

type DayMap = {
  [key: number]: string
}

interface TimeTableProps {
  schedule: Session[]
  dia?: {
    ofLlSpecialite?: string
    ofLlFiliere?: string
    periodeLibelleFr?: string
  }
}

export default function TimeTable({ schedule, dia }: TimeTableProps) {
  const tableRef = useRef<HTMLDivElement>(null)

  const exportToPDF = async () => {
    try {
      console.log('Starting PDF generation...')
      
      // Show loading state
      const loadingElement = document.createElement('div')
      loadingElement.className = 'fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50'
      loadingElement.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow-lg">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p class="mt-2 text-gray-700">Generating PDF...</p>
        </div>
      `
      document.body.appendChild(loadingElement)

      // Create PDF in landscape mode
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      console.log('PDF instance created')

      // Add title and student info
      pdf.setFontSize(16)
      pdf.setTextColor(0, 0, 0)
      pdf.text('Class Schedule', 148.5, 15, { align: 'center' })

      // Add specialty and semester info
      pdf.setFontSize(12)
      pdf.setTextColor(100, 100, 100)
      const specialty = dia?.ofLlSpecialite || dia?.ofLlFiliere || "Not specified"
      const semester = dia?.periodeLibelleFr || "Not specified"
      pdf.text(`Specialty: ${specialty}`, 20, 25)
      pdf.text(`Semester: ${semester}`, 20, 30)

      // Group schedule by day
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

      console.log('Processing schedule data...')

      // Prepare table data
      const tableData = timeSlots.map(slot => {
        if (!slot) return []
        
        const row = [betterSlotFormat(slot)]
        Object.keys(dayMap).forEach(dayId => {
          const dayIdNum = parseInt(dayId, 10)
          const sessions = groupedSchedule[dayIdNum].filter(
            (seance) => seance.plageHoraireLibelleFr === slot
          )
          
          if (sessions.length > 0) {
            const cellContent = sessions.map((seance) => 
              `${seance.matiere}\n${seance.ap}\n${seance.refLieuDesignation}`
            ).join('\n\n')
            row.push(cellContent)
          } else {
            row.push('')
          }
        })
        return row
      })

      console.log('Table data prepared:', tableData)

      try {
        console.log('Adding table to PDF...')
        // Add table to PDF with optimized size settings
        autoTable(pdf, {
          startY: 35,
          margin: { left: 10, right: 10 },
          head: [['Time', ...Object.values(dayMap)]],
          body: tableData,
          theme: 'grid',
          styles: {
            fontSize: 10,
            cellPadding: 4,
            overflow: 'linebreak',
            cellWidth: 'wrap',
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
          },
          headStyles: {
            fillColor: [34, 197, 94],
            textColor: [255, 255, 255],
            fontSize: 12,
            fontStyle: 'bold',
            halign: 'center',
            valign: 'middle',
            cellPadding: 6,
          },
          columnStyles: {
            0: { 
              cellWidth: 35,
              fontSize: 11,
              fontStyle: 'bold',
              halign: 'center',
              valign: 'middle',
            },
            1: { 
              cellWidth: 'auto',
              fontSize: 10,
              valign: 'middle',
            },
            2: { 
              cellWidth: 'auto',
              fontSize: 10,
              valign: 'middle',
            },
            3: { 
              cellWidth: 'auto',
              fontSize: 10,
              valign: 'middle',
            },
            4: { 
              cellWidth: 'auto',
              fontSize: 10,
              valign: 'middle',
            },
            5: { 
              cellWidth: 'auto',
              fontSize: 10,
              valign: 'middle',
            },
            6: { 
              cellWidth: 'auto',
              fontSize: 10,
              valign: 'middle',
            },
          },
          didParseCell: function(data: CellHookData) {
            // Ensure cell content is properly formatted
            if (data.cell.text) {
              if (Array.isArray(data.cell.text)) {
                data.cell.text = data.cell.text.join('\n')
              } else {
                data.cell.text = data.cell.text.toString()
              }
            }
          },
          didDrawPage: function(data) {
            // Add export date at the bottom of each page
            const pageHeight = pdf.internal.pageSize.height
            pdf.setFontSize(8)
            pdf.setTextColor(100, 100, 100)
            const exportDate = new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
            pdf.text(`Generated on: ${exportDate}`, 148.5, pageHeight - 10, { align: 'center' })
          }
        })
        console.log('Table added successfully')
      } catch (tableError: unknown) {
        console.error('Error adding table:', tableError)
        throw new Error('Failed to add table to PDF: ' + (tableError instanceof Error ? tableError.message : 'Unknown error'))
      }

      console.log('Saving PDF...')
      // Save the PDF
      pdf.save('timetable.pdf')

      console.log('PDF saved successfully')

      // Remove loading state
      document.body.removeChild(loadingElement)
    } catch (error) {
      console.error('Error details:', error)
      // Remove loading state if it exists
      const loadingElement = document.querySelector('.fixed.top-0.left-0')
      if (loadingElement) {
        document.body.removeChild(loadingElement)
      }
      alert('Failed to generate PDF: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const betterSlotFormat = (text: string) => {
    return text
      ?.replace(/\s+/g, "") // Remove all spaces
      .replace(/-/g, " - ") // Add spaces around dashes
  }

  const groupByDay = (schedule: Session[]) => {
    const days = [0, 1, 2, 3, 4, 5]
    const grouped: Record<number, Session[]> = {}

    days.forEach((dayId) => {
      grouped[dayId] = schedule.filter((seance) => seance.jourId === dayId)
    })

    return grouped
  }

  const extractTimeSlots = (schedule: Session[]) => {
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
      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export PDF
        </button>
      </div>

      {/* Large Screens View */}
      <div ref={tableRef} data-ref="table" className="overflow-x-auto hidden lg:block mb-2">
        <table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-gradient-to-r from-green-400 to-green-600 text-white">
              <th className="p-4 border-b border-gray-200 text-center text-sm md:text-base font-semibold w-[15%]">
                Time
              </th>
              {Object.entries(dayMap).map(([dayId, dayName]) => (
                <th
                  key={dayId}
                  className="p-4 border-b border-gray-200 text-center text-sm md:text-base font-semibold w-[14%]"
                >
                  {dayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot: any, index: number) => {
              return (
                slot && (
                  <tr
                    key={slot}
                    className={`hover:bg-gray-50 transition duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="p-4 border-b border-gray-200 text-center text-sm font-medium whitespace-nowrap bg-gray-50">
                      {betterSlotFormat(slot)}
                    </td>
                    {Object.keys(dayMap).map((dayId) => (
                      <td
                        key={dayId}
                        className="p-4 border-b border-gray-200 text-center"
                      >
                        {groupedSchedule[parseInt(dayId, 10)]
                          .filter(
                            (seance: any) =>
                              seance.plageHoraireLibelleFr === slot,
                          )
                          .map((seance: any) => (
                            <div
                              key={seance.id}
                              className="flex flex-col items-center m-1 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-200"
                            >
                              <strong className="text-sm text-gray-800 mb-1">
                                {seance.matiere}
                              </strong>
                              <span className="text-sm text-teal-600 font-semibold mb-1">
                                {seance.ap}
                              </span>
                              <span className="text-xs text-purple-600 font-medium">
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
                className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-green-50 to-teal-50 shadow-md"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                  {dayMap[parseInt(dayId, 10)]}
                </h3>
                {timeSlots.map((slot) => {
                  const associatedSessions = sessions.filter(
                    (seance: any) => seance.plageHoraireLibelleFr === slot,
                  )

                  return (
                    associatedSessions.length > 0 && (
                      <div key={slot} className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center bg-white/50 py-2 px-4 rounded-lg">
                          {betterSlotFormat(slot)}
                        </h4>
                        {associatedSessions.map((seance: any) => (
                          <div
                            key={seance.id}
                            className="flex flex-col items-start bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <strong className="text-sm text-gray-800 mb-1">
                              {seance.matiere}
                            </strong>
                            <span className="text-sm text-teal-600 font-semibold mb-1">
                              {seance.ap}
                            </span>
                            <span className="text-xs text-purple-600 font-medium">
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
