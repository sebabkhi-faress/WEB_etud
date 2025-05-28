"use client"

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import NormalNotes from "@/components/NormalNotes"
import UserGroup from "@/components/UserGroup"
import ExamNotes from "@/components/ExamNotes"
import TimeTable from "@/components/TimeTable"

// Component for displaying semester details
const SemesterTab = ({ normal, exam, result, timeTable, dia }: any) => {
  const SemesterTabStyle = `
    rounded 
    p-2 
    text-xs 
    font-semibold 
    transition 
    bg-gray-200 
    text-gray-800  
    border 
    border-gray-300 
    outline-none 
    transition-all 
    duration-300 
    ease-in-out 
    md:text-sm 
    lg:text-lg 
    hover:bg-green-200 
    hover:text-green-800 
    data-[disabled]:text-gray-400 
    data-[disabled]:cursor-not-allowed
    data-[selected]:bg-green-600 
    data-[selected]:text-white 
    data-[disabled]:hover:bg-gray-200 
    data-[selected]:flex-1 
  `

  const pStyle = "text-center mb-3 text-red-700 text-sm sm:text-lg"

  return (
    <TabGroup className="flex flex-col justify-center items-center gap-4 px-2">
      <TabList className="flex w-full gap-2 overflow-x-auto">
        <Tab disabled={!timeTable} className={SemesterTabStyle}>
          Time
        </Tab>
        <Tab className={SemesterTabStyle}>Notes</Tab>
        <Tab disabled={!exam} className={SemesterTabStyle}>
          Exams
        </Tab>
        <Tab disabled={!result} className={SemesterTabStyle}>
          GPA
        </Tab>
      </TabList>
      <TabPanels className="w-full">
        <TabPanel>
          {timeTable ? (
            <TimeTable schedule={timeTable} dia={dia} />
          ) : (
            <p className={pStyle}>Data Not Available!</p>
          )}
        </TabPanel>
        <TabPanel>
          {normal?.length > 0 ? (
            <NormalNotes normal={normal} />
          ) : (
            <p className={pStyle}>Data Not Available!</p>
          )}
        </TabPanel>
        <TabPanel>
          {exam?.normal?.length > 0 ? (
            <ExamNotes item={exam} />
          ) : (
            <p className={pStyle}>Data Not Available!</p>
          )}
        </TabPanel>
        <TabPanel>
          {result?.bilanUes?.length > 0 ? (
            renderSemesterResultItem(result)
          ) : (
            <p className={pStyle}>Data Not Available!</p>
          )}
        </TabPanel>
      </TabPanels>
    </TabGroup>
  )
}

// Function to render year result item
const renderYearResultItem = (result: any) => {
  if (!result || !result[0]) {
    return (
      <div className="text-center p-6 text-red-600 bg-red-50 rounded-lg border border-red-200 shadow-sm">
        Data Not Available!
      </div>
    )
  }

  const { moyenne, typeDecisionLibelleFr, creditAcquis } = result[0]
  const isSuccess = moyenne >= 10.0
  const averageClass = isSuccess ? "text-green-700" : "text-red-700"
  const bgColorClass = isSuccess ? "bg-green-50" : "bg-red-50"

  return (
    <div className={`${bgColorClass} border border-gray-200 w-full p-6 rounded-lg shadow-md`}>
      <table className="w-full">
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="py-3 px-4 text-gray-600 font-normal">Average</td>
            <td className={`py-3 px-4 font-semibold ${averageClass}`}>{moyenne}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-3 px-4 text-gray-600 font-normal">Decision</td>
            <td className={`py-3 px-4 font-semibold ${averageClass}`}>{typeDecisionLibelleFr}</td>
          </tr>
          {creditAcquis > 0 && (
            <tr>
              <td className="py-3 px-4 text-gray-600 font-normal">Credits</td>
              <td className={`py-3 px-4 font-semibold ${averageClass}`}>{creditAcquis}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// Function to render semester result item
const renderSemesterResultItem = (result: any) => {
  const { moyenne, creditAcquis, bilanUes } = result
  const isSuccess = moyenne >= 10.0
  const containerBgClass = isSuccess ? "bg-green-50" : "bg-red-50"
  const moyenneClass = isSuccess ? "text-green-700" : "text-red-700"

  return (
    <div className={`${containerBgClass} border border-gray-200 w-full p-6 space-y-6 rounded-lg shadow-md`}>
      {bilanUes?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full mb-6">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-gray-600 font-normal">Overall Average</td>
                <td className={`py-3 px-4 font-semibold ${moyenneClass}`}>{moyenne}</td>
              </tr>
              {creditAcquis > 0 && (
                <tr>
                  <td className="py-3 px-4 text-gray-600 font-normal">Credits Acquired</td>
                  <td className={`py-3 px-4 font-semibold ${moyenneClass}`}>{creditAcquis}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-6">
        {bilanUes?.map((ue: any, index: number) => {
          const ueIsSuccess = ue.moyenne >= 10
          const ueBgClass = ueIsSuccess ? "bg-green-50" : "bg-red-50"
          const ueAverageClass = ueIsSuccess ? "text-green-700" : "text-red-700"

          return (
            <div key={index} className={`${ueBgClass} border border-gray-200 rounded-lg shadow-sm overflow-hidden`}>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-gray-700 font-semibold">
                  {ue.ueNatureLcFr}: {ue.ueLibelleFr}
                </h3>
              </div>
              
              <div className="p-4">
                <table className="w-full mb-4">
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 text-gray-600 font-normal">UE Average</td>
                      <td className={`py-2 px-4 font-semibold ${ueAverageClass}`}>{ue.moyenne}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="space-y-4">
                  {ue.bilanMcs.map((mc: any, mcIndex: number) => {
                    const mcIsSuccess = mc.moyenneGenerale >= 10.0
                    const mcAverageClass = mcIsSuccess ? "text-green-700" : "text-red-700"

                    return (
                      <div key={mcIndex} className="bg-white rounded-lg border border-gray-200 p-4">
                        <table className="w-full">
                          <tbody>
                            <tr>
                              <td className="py-2 px-4 text-gray-600 font-normal">Module</td>
                              <td className="py-2 px-4 font-semibold text-gray-700">{mc.mcLibelleFr}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 text-gray-600 font-normal">Average</td>
                              <td className={`py-2 px-4 font-semibold ${mcAverageClass}`}>
                                {mc.moyenneGenerale ? mc.moyenneGenerale : "N/A"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Main client component for displaying the panel tabs
export default function PanelTabs({
  dias,
  params,
  normalNotes,
  examNotes,
  semesterResults,
  yearResults,
  groupData,
  timeTableData,
}: any) {

  // Organize fetched data (repeated from page.tsx, but needed here for the client component logic)
  const { firstSemNotes = null, secondSemNotes = null } =
    (normalNotes as any) || {}
  const { firstSemExams = null, secondSemExams = null } =
    (examNotes as any) || {}
  const { firstSemResults = null, secondSemResults = null } =
    (semesterResults as any) || {}
  let { firstTable = null, secondTable = null } = (timeTableData as any) || {}

  // Get the current dia
  const currentDia = dias?.find((dia: any) => dia.id === params?.id)

  // Adjust tables based on group data (repeated from page.tsx)
  if (firstTable?.periodId === groupData?.[1]?.PeriodId) {
    secondTable = firstTable
    firstTable = null
  }

  // Define tab styles (repeated from page.tsx)
  const TabStyle = `
    rounded 
    px-1 
    py-3 
    text-xs 
    font-semibold 
    transition 
    bg-gray-200 
    text-gray-800 
    border 
    border-gray-300 
    outline-none 
    flex-1
    md:text-base 
    lg:text-lg 
    data-[selected]:bg-green-600 
    data-[selected]:text-white 
    data-[enabled]:hover:bg-green-200 
    data-[enabled]:hover:text-green-800 
    data-[disabled]:text-gray-400 
    data-[disabled]:cursor-not-allowed 
  `

  return (
    <TabGroup className="flex flex-col justify-start items-center w-full py-4 px-2 md:p-4 gap-2 md:gap-4">
      <TabList className="flex gap-1 md:gap-2 overflow-x-auto w-full max-w-4xl border border-gray-300 p-2 rounded">
        {secondSemNotes?.length > 0 || secondSemExams?.normal?.length > 0 ? (
          <>
            <Tab className={TabStyle}>
              {groupData?.[0]?.name ? groupData[0].name : "Semester 1"}
            </Tab>
            <Tab className={TabStyle}>
              {groupData?.[1]?.name ? groupData[1].name : "Semester 2"}
            </Tab>
          </>
        ) : (
          <Tab className={TabStyle}>
            {groupData?.[0]?.name?.includes("Semestre")
              ? groupData[0].name
              : "All"}
          </Tab>
        )}
        <Tab disabled={!yearResults} className={TabStyle}>
          Yearly
        </Tab>
        <Tab disabled={!groupData || groupData.length < 1} className={TabStyle}>
          Group
        </Tab>
      </TabList>
      <TabPanels className="w-full max-w-4xl border border-gray-300 p-2 rounded">
        {secondSemNotes?.length > 0 || secondSemExams?.normal?.length > 0 ? (
          <>
            <TabPanel>
              <SemesterTab
                normal={firstSemNotes}
                exam={firstSemExams}
                result={firstSemResults}
                timeTable={firstTable?.schedule}
                dia={currentDia}
              />
            </TabPanel>
            <TabPanel>
              <SemesterTab
                normal={secondSemNotes}
                exam={secondSemExams}
                result={secondSemResults}
                timeTable={secondTable?.schedule}
                dia={currentDia}
              />
            </TabPanel>
          </>
        ) : (
          <TabPanel>
            <SemesterTab
              normal={firstSemNotes}
              exam={firstSemExams}
              result={firstSemResults}
              timeTable={firstTable?.schedule}
              dia={currentDia}
            />
          </TabPanel>
        )}
        <TabPanel>{yearResults && renderYearResultItem(yearResults)}</TabPanel>
        <TabPanel>
          {groupData && groupData.length > 0 && <UserGroup group={groupData} />}
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
} 