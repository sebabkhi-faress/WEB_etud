import {
  getOrdinaryNotes,
  getExamsNotes,
  getSemesterAcademicResults,
  getYearAcademicResults,
  getGroup,
} from "@/utils/api/panel"

export const metadata = {
  title: "WebEtu - Panel",
}

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import OrdinaryNotes from "@/components/OrdinaryNotes"
import ExamNotes from "@/components/ExamNotes"

export default async function PeriodTab({ params }: any) {
  const [
    ordinaryPromise,
    examsPromise,
    semesterResultsPromise,
    yearResultsPromise,
    groupPromise,
  ] = [
    getOrdinaryNotes(params.year),
    getExamsNotes(params.year),
    getSemesterAcademicResults(params.year),
    getYearAcademicResults(params.year),
    getGroup(params.year),
  ]

  // Wait for all promises to resolve
  const [ordinary, exams, semesterResults, yearResults, group] =
    await Promise.all([
      ordinaryPromise,
      examsPromise,
      semesterResultsPromise,
      yearResultsPromise,
      groupPromise,
    ])

  // Destructure the results from the resolved promises
  const { Sem1Ordinary, Sem2Ordinary } = ordinary as any
  const { Sem1Exams, Sem2Exams } = exams as any
  const { Sem1Results, Sem2Results } = semesterResults as any
  return (
    <TabGroup className="flex flex-col justify-start items-center gap-4">
      <TabList className="flex gap-2 overflow-x-auto">
        <Tab className="rounded-lg px-3 py-2 text-sm md:text-lg lg:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-800">
          Semester 1
        </Tab>
        <Tab className="rounded-lg px-3 py-2 text-sm md:text-lg lg:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-800">
          Semester 2
        </Tab>
        <Tab className="rounded-lg px-3 py-2 text-sm md:text-lg lg:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-800">
          Annual
        </Tab>
        <Tab className="rounded-lg px-3 py-2 text-sm md:text-lg lg:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-800">
          Group
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SemesterTab
            result={Sem1Results}
            ordinary={Sem1Ordinary}
            exam={Sem1Exams}
          />
        </TabPanel>
        <TabPanel>
          <SemesterTab
            result={Sem2Results}
            ordinary={Sem2Ordinary}
            exam={Sem2Exams}
          />
        </TabPanel>
        <TabPanel>{yearResults && renderYearResultItem(yearResults)}</TabPanel>
        <TabPanel className="flex overflow-x-auto p-1 justify-center">
          {group && Object.keys(group).length > 0 && (
            <div className="bg-gradient-to-r from-gray-200 to-gray-300/90 border border-gray-400 w-full max-w-7xl mx-auto p-8 rounded-lg shadow-md">
              <div
                className={`grid gap-8 ${
                  Object.keys(group).length === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {Object.entries(group).map(([semester, info]: any, index) => (
                  <div key={index} className="p-4">
                    <h2 className="w-full text-2xl rounded-lg py-4 px-6 text-center bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md">
                      {semester}
                    </h2>
                    <div className="border border-gray-400 bg-white rounded-lg p-6 mt-4 shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
                      <p className="mb-4 text-lg text-gray-700 whitespace-nowrap">
                        <span className="font-semibold text-gray-800">
                          Section:
                        </span>{" "}
                        {info.section}
                      </p>
                      <p className="mb-4 text-lg text-gray-700 whitespace-nowrap">
                        <span className="font-semibold text-gray-800">
                          Group:
                        </span>{" "}
                        {info.group}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabPanel>
      </TabPanels>
    </TabGroup>
  )
}

const SemesterTab = ({ ordinary, exam, result }: any) => {
  return (
    <TabGroup className="flex flex-col justify-center items-center gap-4">
      <TabList className="flex gap-2 overflow-x-auto">
        <Tab className="rounded-lg px-3 py-2 text-sm md:text-lg lg:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-800">
          Notes
        </Tab>
        <Tab className="rounded-lg px-3 py-2 text-sm md:text-lg lg:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-800">
          Exams
        </Tab>
        <Tab className="rounded-lg px-3 py-2 text-sm md:text-lg lg:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-800">
          Total
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <div className="flex flex-col gap-2">
            {ordinary &&
              ordinary.map((item: any) => (
                <OrdinaryNotes key={item.id} item={item} />
              ))}
          </div>
        </TabPanel>
        <TabPanel>{exam && <ExamNotes item={exam} />}</TabPanel>
        <TabPanel>{result && renderSemesterResultItem(result, 1)}</TabPanel>
      </TabPanels>
    </TabGroup>
  )
}

const renderYearResultItem = (result: any) => {
  const { moyenne, typeDecisionLibelleFr, creditAcquis } = result[0]
  const averageClass = moyenne >= 10.0 ? "text-green-800" : "text-red-800"
  const ueBgClass = moyenne >= 10 ? "bg-green-100" : "bg-red-100"

  return (
    <div
      className={`${ueBgClass} border border-gray-400 w-full max-w-3xl mx-auto p-6 rounded-lg shadow-lg capitalize`}
    >
      <p className="text-lg text-gray-700 mb-2 font-semibold">
        <span>Average: </span>
        <span className={averageClass}>{moyenne}</span>
      </p>
      <p className="text-lg text-gray-700 mb-2 font-semibold">
        <span>Decision: </span>
        <span className={averageClass}>{typeDecisionLibelleFr}</span>
      </p>
      <p className="text-lg text-gray-700 mb-2 font-semibold">
        <span>Credits: </span>
        <span className={averageClass}>{creditAcquis}</span>
      </p>
    </div>
  )
}

const renderSemesterResultItem = (result: any, index: any) => {
  const { moyenne, creditAcquis, bilanUes } = result
  const moyenneClass = moyenne >= 10.0 ? "text-green-800" : "text-red-800" // Softer green and red

  return (
    <div
      className={`${
        moyenne < 10 ? "bg-red-200/65" : "bg-green-200/65"
      } border border-gray-400 w-full max-w-3xl mx-auto p-6 rounded-lg shadow-lg`}
      key={index}
    >
      <div className="mb-6">
        <p className="text-lg text-gray-700 font-bold">
          <span>Average: </span>
          <span className={moyenneClass}>{moyenne}</span>
        </p>
        <p className="text-lg text-gray-700 font-bold">
          <span>Credits: </span>
          <span className={moyenneClass}>{creditAcquis}</span>
        </p>
      </div>
      <div>
        {bilanUes.map((ue: any, ueIndex: any) => {
          const ueBgClass = ue.moyenne >= 10 ? "bg-green-50" : "bg-red-50" // Softer background colors
          const ueAverageClass =
            ue.moyenne >= 10.0 ? "text-green-800" : "text-red-800"

          return (
            <div
              key={ueIndex}
              className={`mb-6 p-4 ${ueBgClass} border border-gray-400 rounded-lg capitalize`}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {ue.ueNatureLcFr}: {ue.ueLibelleFr}
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                <span className="font-semibold">Average: </span>
                <span className={`${ueAverageClass} font-bold`}>
                  {ue.moyenne}
                </span>
              </p>
              <div className="ml-4">
                {ue.bilanMcs.map((mc: any, mcIndex: any) => {
                  const mcAverageClass =
                    mc.moyenneGenerale >= 10.0
                      ? "text-green-800"
                      : "text-red-800"

                  return (
                    <div
                      key={mcIndex}
                      className="mb-4 p-3 border border-gray-400 rounded-lg"
                    >
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        Module:{" "}
                        <span className={mcAverageClass}>{mc.mcLibelleFr}</span>
                      </h4>
                      <p className="text-gray-800">
                        <span className="font-semibold">Average: </span>
                        <span className={`${mcAverageClass} font-bold`}>
                          {mc.moyenneGenerale}
                        </span>
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
