import {
  getNormalNotes,
  getExamsNotes,
  getSemesterResults,
  getGroup,
  getYearTranscript,
  getDias,
} from "@/utils/api/panel"

export const metadata = {
  title: "WebEtu - Panel",
}

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import NormalNotes from "@/components/NormalNotes"
import UserGroup from "@/components/UserGroup"
import ExamNotes from "@/components/ExamNotes"
import logger from "@/utils/logger"
import { getCookieData } from "@/utils/api/helpers"

export default async function PeriodTab({ params }: any) {
  const dias = await getDias()

  if (
    !dias.find((dia: any) => dia.id == params.year) &&
    process.env.DIA_SECURITY === "true"
  ) {
    const { user } = getCookieData()
    logger.warn("Unauthorized Access Attempt", user, "Security")
    return "Not Allowed!"
  }

  const [
    normalPromise,
    examsPromise,
    semesterResultsPromise,
    yearResultsPromise,
    groupPromise,
  ] = [
    getNormalNotes(params.year),
    getExamsNotes(params.year),
    getSemesterResults(params.year),
    getYearTranscript(params.year),
    getGroup(params.year),
  ]

  const [normal, exams, semesterResults, yearResults, group] =
    await Promise.all([
      normalPromise,
      examsPromise,
      semesterResultsPromise,
      yearResultsPromise,
      groupPromise,
    ])

  const { firstSemNotes, secondSemNotes } = normal as any
  const { firstSemExams, secondSemExams } = exams as any
  const { firstSemResults, secondSemResults } = semesterResults as any

  const TabStyle =
    "rounded px-1 py-3 text-xs md:text-base lg:text-lg font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white data-[disabled]:text-gray-400 data-[disabled]:cursor-not-allowed bg-gray-200 text-gray-800 data-[enabled]:hover:bg-green-200 data-[enabled]:hover:text-green-800 border border-gray-300 outline-none flex-1"

  return (
    <TabGroup className="flex flex-col justify-start items-center w-full py-4 px-2 md:p-4 gap-2 md:gap-4">
      <TabList className="flex gap-1 md:gap-2 overflow-x-auto w-full max-w-4xl border border-gray-300 p-2 rounded">
        {secondSemNotes?.length > 0 || secondSemExams?.normal?.length > 0 ? (
          <>
            <Tab className={TabStyle}>{Object.keys(group)[0]}</Tab>
            <Tab className={TabStyle}>{Object.keys(group)[1]}</Tab>
          </>
        ) : (
          <Tab className={TabStyle}>
            {group && Object.keys(group)[0].includes("Semestre")
              ? Object.keys(group)[0]
              : "All"}
          </Tab>
        )}
        <Tab disabled={!yearResults} className={TabStyle}>
          Yearly
        </Tab>
        <Tab disabled={!group} className={TabStyle}>
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
              />
            </TabPanel>
            <TabPanel>
              <SemesterTab
                normal={secondSemNotes}
                exam={secondSemExams}
                result={secondSemResults}
              />
            </TabPanel>
          </>
        ) : (
          <TabPanel>
            <SemesterTab
              normal={firstSemNotes}
              exam={firstSemExams}
              result={firstSemResults}
            />
          </TabPanel>
        )}
        <TabPanel>{yearResults && renderYearResultItem(yearResults)}</TabPanel>
        <TabPanel>
          {group && Object.keys(group).length > 0 && (
            <UserGroup group={group} />
          )}
        </TabPanel>
      </TabPanels>
    </TabGroup>
  )
}

const SemesterTab = ({ normal, exam, result }: any) => {
  const SemesterTabStyle =
    "rounded p-2 text-xs md:text-sm lg:text-lg font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-800 border border-gray-300 outline-none data-[selected]:flex-1 transition-all duration-300 ease-in-out"
  const pStyle = "text-center mb-3 text-red-700"

  return (
    <TabGroup className="flex flex-col justify-center items-center gap-4 px-2">
      <TabList className="flex w-full gap-2 overflow-x-auto">
        <Tab className={SemesterTabStyle}>Notes</Tab>
        <Tab className={SemesterTabStyle}>Exams</Tab>
        <Tab className={SemesterTabStyle}>Total</Tab>
      </TabList>
      <TabPanels className="w-full">
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

const renderYearResultItem = (result: any) => {
  const { moyenne, typeDecisionLibelleFr, creditAcquis } = result[0]
  const averageClass = moyenne >= 10.0 ? "text-green-800" : "text-red-800"
  const ueBgClass = moyenne >= 10 ? "bg-green-100" : "bg-red-100"

  return (
    <div
      className={`${ueBgClass} border border-gray-300 w-full p-4 text-sm md:text-base lg:text-lg text-gray-700 space-y-4 font-semibold rounded capitalize text-center`}
    >
      <p>
        <span>Average: </span>
        <span className={averageClass}>{moyenne}</span>
      </p>
      <p>
        <span>Decision: </span>
        <span className={averageClass}>{typeDecisionLibelleFr}</span>
      </p>
      {creditAcquis > 0 && (
        <p>
          <span>Credits: </span>
          <span className={averageClass}>{creditAcquis}</span>
        </p>
      )}
    </div>
  )
}

const renderSemesterResultItem = (result: any) => {
  const { moyenne, creditAcquis, bilanUes } = result
  const divBgClass = moyenne < 10 ? "bg-red-200/65" : "bg-green-200/65"
  const moyenneClass = moyenne >= 10.0 ? "text-green-800" : "text-red-800"

  return (
    <div
      className={`${divBgClass} border border-gray-300 w-full p-5 space-y-4 rounded mb-2`}
    >
      <div className="md:text-lg lg:text-xl text-gray-700 font-bold">
        {bilanUes?.length > 1 && (
          <p>
            <span>Average: </span>
            <span className={moyenneClass}>{moyenne}</span>
          </p>
        )}
        {creditAcquis > 0 && (
          <p>
            <span>Credits: </span>
            <span className={moyenneClass}>{creditAcquis}</span>
          </p>
        )}
      </div>
      <div className="space-y-4">
        {bilanUes?.map((ue: any, index: number) => {
          const ueBgClass = ue.moyenne >= 10 ? "bg-green-50" : "bg-red-50"
          const ueAverageClass =
            ue.moyenne >= 10.0 ? "text-green-800" : "text-red-800"

          return (
            <div
              key={index}
              className={`p-5 ${ueBgClass} space-y-2 border border-gray-300 rounded capitalize text-sm md:text-base lg:text-lg font-semibold text-gray-800`}
            >
              <h3>
                {ue.ueNatureLcFr}: {ue.ueLibelleFr}
              </h3>
              <p>
                <span>Average: </span>
                <span className={`${ueAverageClass} font-bold`}>
                  {ue.moyenne}
                </span>
              </p>
              <div className="space-y-4">
                {ue.bilanMcs.map((mc: any, mcIndex: number) => {
                  const mcAverageClass =
                    mc.moyenneGenerale >= 10.0
                      ? "text-green-800"
                      : "text-red-800"

                  return (
                    <div
                      key={mcIndex}
                      className="p-3 border border-gray-300 rounded"
                    >
                      <h4 className="font-semibold text-gray-800">
                        Module:{" "}
                        <span className={mcAverageClass}>{mc.mcLibelleFr}</span>
                      </h4>
                      <p className="text-gray-800">
                        <span className="font-semibold">Average: </span>
                        <span className={`${mcAverageClass} font-bold`}>
                          {mc.moyenneGenerale ? mc.moyenneGenerale : "Empty"}
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
