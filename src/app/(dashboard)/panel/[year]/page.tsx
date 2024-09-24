import {
  getTdTp,
  getExamsNotes,
  getSemesterAcademicResults,
  getYearAcademicResults,
  getGroup,
} from "@/api"

export const metadata = {
  title: "WebEtu - Panel",
}

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"

export default async function PeriodTab({ params }: any) {
  const [
    tdTpPromise,
    examsPromise,
    semesterResultsPromise,
    yearResultsPromise,
    groupPromise,
  ] = [
    getTdTp(params.year),
    getExamsNotes(params.year),
    getSemesterAcademicResults(params.year),
    getYearAcademicResults(params.year),
    getGroup(params.year),
  ]

  // Wait for all promises to resolve
  const [tdTp, exams, semesterResults, yearResults, group] = await Promise.all([
    tdTpPromise,
    examsPromise,
    semesterResultsPromise,
    yearResultsPromise,
    groupPromise,
  ])

  // Destructure the results from the resolved promises
  const { Sem1TdTp, Sem2TdTp } = tdTp as any
  const { Sem1Exams, Sem2Exams } = exams as any
  const { Sem1Results, Sem2Results } = semesterResults as any
  return (
    <TabGroup className="flex flex-col justify-start items-center gap-4">
      <TabList className="flex gap-2 overflow-x-auto">
        <Tab className="rounded-lg px-3 py-2 text-sm md:text-lg lg:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700">
          Semester 1
        </Tab>
        <Tab className="rounded-lg px-3 py-2 text-sm md:text-lg lg:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700">
          Semester 2
        </Tab>
        <Tab className="rounded-lg px-3 py-2 text-sm md:text-lg lg:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700">
          Annual
        </Tab>
        <Tab className="rounded-lg px-3 py-2 text-sm md:text-lg lg:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700">
          Group
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SemesterTab result={Sem1Results} td={Sem1TdTp} exam={Sem1Exams} />
        </TabPanel>
        <TabPanel>
          <SemesterTab result={Sem2Results} td={Sem2TdTp} exam={Sem2Exams} />
        </TabPanel>
        <TabPanel>{yearResults && renderYearResultItem(yearResults)}</TabPanel>
        <TabPanel className="flex overflow-x-auto p-4 justify-center">
          {group && (
            <div className="bg-gray-200 border border-gray-300 w-full max-w-7xl mx-auto p-8 rounded-lg shadow-md">
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
                    <div className="border border-gray-200 bg-white rounded-lg p-6 mt-4 shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
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

const SemesterTab = ({ td, exam, result }: any) => {
  return (
    <TabGroup className="flex flex-col justify-center items-center gap-4">
      <TabList className="flex gap-2 overflow-x-auto">
        <Tab className="rounded-lg px-3 py-2 text-sm md:text-lg lg:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700">
          Notes
        </Tab>
        <Tab className="rounded-lg px-3 py-2 text-sm md:text-lg lg:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700">
          Exams
        </Tab>
        <Tab className="rounded-lg px-3 py-2 text-sm md:text-lg lg:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700">
          Total
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <div className="flex flex-col gap-2">
            {td &&
              td.map((item: any) => <TdNoteItem key={item.id} item={item} />)}
          </div>
        </TabPanel>
        <TabPanel>{exam && <ExamNotes item={exam} />}</TabPanel>
        <TabPanel>{result && renderSemesterResultItem(result, 1)}</TabPanel>
      </TabPanels>
    </TabGroup>
  )
}

const TdNoteItem = ({ item }: any) => (
  <div
    className={`border border-gray-900 text-gray-800 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center shadow-md transition duration-300 ease-in-out transform hover:scale-105 capitalize ${
      item.note >= 10
        ? "bg-green-200 text-green-900"
        : "bg-red-200 text-red-900"
    }`}
    style={{ marginBottom: "0.5rem" }} // Reduced bottom margin to 0.5rem
  >
    <p className="font-semibold" style={{ marginRight: "1rem" }}>
      {item.rattachementMcMcLibelleFr}
    </p>
    <div className="flex gap-4 mt-2 sm:mt-0">
      <p className="font-bold text-lg">
        {item.note != null ? item.note : "Empty"}
      </p>
      <p className="font-bold text-lg">{item.apCode}</p>
    </div>
  </div>
)

const ExamNotes = ({ item }: any) => {
  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-700 text-center">
          Normal Session
        </h3>
        <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 capitalize">
          {item.normal.map((course: any) => (
            <div
              className={`text-gray-800 rounded-lg p-4 shadow-md transition transform hover:scale-105 border border-gray-900 ${
                course.noteExamen >= 10
                  ? "bg-green-200 text-green-900"
                  : "bg-red-200 text-red-900"
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
                className={`rounded-lg p-4 shadow-md transition transform hover:scale-105 border border-gray-900 ${
                  course.noteExamen >= 10
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }`}
                key={course.id}
              >
                <h4 className="font-semibold">{course.mcLibelleFr}</h4>
                <p className="font-bold text-lg">
                  {course.noteExamen != null ? course.noteExamen : "Empty"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

const renderYearResultItem = (result: any) => {
  const { moyenne, typeDecisionLibelleFr, creditAcquis } = result[0]
  const averageClass = moyenne >= 10.0 ? "text-green-700" : "text-red-700"
  const ueBgClass = moyenne > 10 ? "bg-green-100" : "bg-red-100"

  return (
    <div
      className={`${ueBgClass} border border-gray-900 w-full max-w-3xl mx-auto p-6 rounded-lg shadow-lg capitalize`}
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
  const moyenneClass = moyenne >= 10.0 ? "text-green-800" : "text-red-800"

  return (
    <div
      className={`${
        moyenne < 10 ? "bg-red-200" : "bg-green-200"
      } border border-gray-900 w-full max-w-3xl mx-auto p-6 rounded-lg shadow-lg`}
      key={index}
    >
      <div className="mb-6">
        <p className="text-lg text-gray-800 font-bold">
          <span>Average: </span>
          <span className={moyenneClass}>{moyenne}</span>
        </p>
        <p className="text-lg text-gray-800 font-bold">
          <span>Credits: </span>
          <span className={moyenneClass}>{creditAcquis}</span>
        </p>
      </div>
      <div>
        {bilanUes.map((ue: any, ueIndex: any) => {
          const ueBgClass = ue.moyenne > 10 ? "bg-green-100" : "bg-red-100"
          const ueAverageClass =
            ue.moyenne >= 10.0 ? "text-green-700" : "text-red-700"

          return (
            <div
              key={ueIndex}
              className={`mb-6 p-4 ${ueBgClass} border border-gray-900 rounded-lg capitalize`}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {ue.ueNatureLcFr}: {ue.ueLibelleFr}
              </h3>
              <p className="text-lg text-gray-800 mb-2">
                <span className="font-semibold">Average: </span>
                <span className={`${ueAverageClass} font-bold`}>
                  {ue.moyenne}
                </span>
              </p>
              <div className="ml-4">
                {ue.bilanMcs.map((mc: any, mcIndex: any) => {
                  const mcAverageClass =
                    mc.moyenneGenerale >= 10.0
                      ? "text-green-700"
                      : "text-red-700"

                  return (
                    <div
                      key={mcIndex}
                      className="mb-4 p-3 border border-gray-900 rounded-lg"
                    >
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        Module:{" "}
                        <span className={mcAverageClass}>{mc.mcLibelleFr}</span>
                      </h4>
                      <p className="text-gray-800">
                        <span className="font-semibold">Module Average: </span>
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
