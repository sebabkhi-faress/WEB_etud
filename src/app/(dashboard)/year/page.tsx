import { cookies } from "next/headers";
import axios from "axios";
import logger from "@/utils";
import cache from "@/cache";

export const metadata = {
  title: "WebEtu - Notes",
};

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

const getCookieData = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value;
  const uuid = cookieStore.get("uuid")?.value;

  return { token, user, uuid };
};

const getDias = async () => {
  const { token, user, uuid } = getCookieData();

  try {
    const response = await axios.get(
      `https://progres.mesrs.dz/api/infos/bac/${uuid}/dias`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 100000,
      }
    );
    logger.info("dias fetched successfully", user, "/years");

    return response.data;
  } catch (error: any) {
    logger.error(`Error - ${error}`, user, "/years");
    return null;
  }
};

const getTdTp = async (id: number) => {
  const { token, user } = getCookieData();

  const cacheKey = `notes-${id}-${user}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info("notes cache hit", user, "/notes");
    return cachedData;
  }

  const parseData = (data: any) => {
    const Sem1TdTp = [] as any[];
    const Sem2TdTp = [] as any[];

    let sem1 = data[0].llPeriode;
    let sem2 = data.find((item: any) => item.llPeriode !== sem1).llPeriode;
    if (sem1 > sem2) {
      sem1 = sem2;
    }
    data.forEach((item: any) => {
      if (item.llPeriode === sem1) {
        Sem1TdTp.push(item);
      } else {
        Sem2TdTp.push(item);
      }
    });
    return { Sem1TdTp, Sem2TdTp };
  };

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/controleContinue/dia/${id}/notesCC`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 10000,
      }
    );

    logger.info("Notes fetched successfully", user, "/notes");
    const data = parseData(res.data);
    cache.set(cacheKey, data);

    return data;
  } catch (error: any) {
    logger.error("Error fetching TP and Td Notes", user, "/notes");
    throw new Error("Error fetching TP and Td Notes");
  }
};

const getExamsNotes = async (id: number) => {
  const { token, user } = getCookieData();

  const cacheKey = `exams-${id}-${user}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info("exams cache hit", user, "/exams");
    return cachedData;
  }

  const parseData = (data: any) => {
    const Sem1Exams = {
      normal: [],
      rattrappage: [],
    } as any;
    const Sem2Exams = {
      normal: [],
      rattrappage: [],
    } as any;

    const periods = data.map((course: any) => course.idPeriode);
    const firstSemester = Math.min(...periods);

    data.forEach((course: any) => {
      const period = course.idPeriode;
      const session = course.planningSessionIntitule;
      const sem1 = period == firstSemester;

      if (session === "session_1") {
        sem1 ? Sem1Exams.normal.push(course) : Sem2Exams.normal.push(course);
      } else {
        sem1
          ? Sem1Exams.rattrappage.push(course)
          : Sem2Exams.rattrappage.push(course);
      }
    });

    return { Sem1Exams, Sem2Exams };
  };

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/planningSession/dia/${id}/noteExamens`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 10000,
      }
    );

    logger.info("Exam Notes fetched successfully", user, "/exams");
    const data = parseData(res.data);
    cache.set(cacheKey, data);
    return data;
  } catch (error: any) {
    logger.error("Error fetching exam notes", user, "/exams");
    throw Error("Error fetching Exam Notes");
  }
};

const getSemesterAcademicResults = async (id: number) => {
  const { token, user } = getCookieData();
  const cacheKey = `semesters-transcripts-${id}-${user}`;
  const cachedData = cache.get(cacheKey);

  const parseData = (data: any) => {
    let sem1 = data[0].periodeLibelleFr < data[1].periodeLibelleFr ? 0 : 1;
    let Sem1Results;
    let Sem2Results;
    if (sem1 === 0) {
      Sem1Results = data[0];
      Sem2Results = data[1];
    } else {
      Sem1Results = data[1];
      Sem2Results = data[0];
    }
    return { Sem1Results, Sem2Results };
  };

  if (cachedData) {
    logger.info("Semesters Transcripts Cache Hit", user, "/transcripts");
    return cachedData;
  }

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/bac/${token}/dias/${id}/periode/bilans`,
      {
        headers: { Authorization: token },
        timeout: 10000,
      }
    );

    logger.info(
      "Fetched Semesters Academic Results Successfully",
      user,
      "/years"
    );
    const data = parseData(res.data);

    cache.set(cacheKey, data);

    return data;
  } catch (error) {
    logger.error("Error Fetching Semesters Academic Results", user, "/years");
    throw new Error("Error Fetching Semesters Academic Results");
  }
};

const getYearAcademicResults = async (id: number) => {
  const { token, user } = getCookieData();
  const cacheKey = `year-transcript-${id}-${user}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info("Year Transcript Cache Hit", user, "/transcripts");
    return cachedData;
  }

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/bac/${token}/dia/${id}/annuel/bilan`,
      {
        headers: { Authorization: token },
        timeout: 10000,
      }
    );

    const data = res.data;
    logger.info("Fetched Year Academic Results Successfully", user, "/years");
    cache.set(cacheKey, data);

    return data;
  } catch (error) {
    logger.error("Error Fetching Year Academic Results", user, "/years");
    throw new Error("Error Fetching Year Academic Results");
  }
};

const PeriodTab = async ({ id }: any) => {
  const [
    tdTpPromise,
    examsPromise,
    semesterResultsPromise,
    yearResultsPromise,
  ] = [
    getTdTp(id),
    getExamsNotes(id),
    getSemesterAcademicResults(id),
    getYearAcademicResults(id),
  ];

  // Wait for all promises to resolve
  const [tdTp, exams, semesterResults, yearResults] = await Promise.all([
    tdTpPromise,
    examsPromise,
    semesterResultsPromise,
    yearResultsPromise,
  ]);

  // Destructure the results from the resolved promises
  const { Sem1TdTp, Sem2TdTp } = tdTp as any;
  const { Sem1Exams, Sem2Exams } = exams as any;
  const { Sem1Results, Sem2Results } = semesterResults as any;

  return (
    <TabGroup className="flex justify-start items-center gap-4 flex-col">
      <TabList className="flex gap-2">
        <Tab className="rounded-lg px-4 py-2 text-lg md:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700">
          Semester 1
        </Tab>
        <Tab className="rounded-lg px-4 py-2 text-lg md:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700">
          Semester 2
        </Tab>
        <Tab className="rounded-lg px-4 py-2 text-lg md:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700">
          Annual
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SemesterTab result={Sem1Results} td={Sem1TdTp} exam={Sem1Exams} />
        </TabPanel>
        <TabPanel>
          <SemesterTab result={Sem2Results} td={Sem2TdTp} exam={Sem2Exams} />
        </TabPanel>
        <TabPanel>{renderYearResultItem(yearResults)}</TabPanel>
      </TabPanels>
    </TabGroup>
  );
};

const SemesterTab = ({ td, exam, result }: any) => {
  return (
    <TabGroup className="flex justify-center items-center gap-4 flex-col">
      <TabList className="flex gap-2">
        <Tab className="rounded-lg px-4 py-2 text-lg md:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700">
          Notes
        </Tab>
        <Tab className="rounded-lg px-4 py-2 text-lg md:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700">
          Exams
        </Tab>
        <Tab className="rounded-lg px-4 py-2 text-lg md:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700">
          Total
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <div className="flex flex-col gap-2">
            {td.map((item: any) => (
              <TdNoteItem key={item.id} item={item} />
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <ExamNotes item={exam} />
        </TabPanel>
        <TabPanel>{renderSemesterResultItem(result, 1)}</TabPanel>
      </TabPanels>
    </TabGroup>
  );
};

const TdNoteItem = ({ item }: { item: any }) => (
  <div
    className={`text-gray-800 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center shadow-md transition duration-300 ease-in-out transform hover:scale-105 capitalize ${
      item.note >= 10
        ? "bg-green-200"
        : "bg-red-200"
    }`}
    key={item.id}
    style={{ marginBottom: "0.5rem"}} // Reduced bottom margin to 0.5rem
  >
    <p className="font-semibold" style={{"marginRight": "1rem" }}>{item.rattachementMcMcLibelleFr}</p>
    <div className="flex gap-4 mt-2 sm:mt-0">
      <p className="font-bold text-lg">
        {item.note != null ? item.note : "Empty"}
      </p>
      <p className="font-bold text-lg">{item.apCode}</p>
    </div>
  </div>
);

const ExamNotes = ({ item }: any) => {
  return (
    <>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-700">Normal Session</h3>
        <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 capitalize">
          {item.normal.map((course: any) => (
            <div
              className={`text-gray-800 rounded-lg p-4 shadow-md transition transform hover:scale-105 ${
                course.noteExamen >= 10
                  ? "bg-green-200"
                  : "bg-red-200"
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
          <h3 className="text-xl font-bold text-gray-700">
            Rattrappage Session
          </h3>
          <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 capitalize">
            {item.rattrappage.map((course: any) => (
              <div
                className={`rounded-lg p-4 shadow-md transition transform hover:scale-105 ${
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
  );
};

const renderYearResultItem = (result: any) => {
  const { moyenne, typeDecisionLibelleFr, creditAcquis } = result[0];
  const averageClass = moyenne >= 10.0 ? "text-green-700" : "text-red-700";

  return (
    <div className="bg-white border border-gray-300 w-full max-w-3xl mx-auto my-6 p-6 rounded-lg shadow-lg capitalize">
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
  );
};

const renderSemesterResultItem = (result: any, index: any) => {
  const { moyenne, creditAcquis, bilanUes } = result;
  const moyenneClass = moyenne >= 10.0 ? "text-green-600" : "text-red-600";

  return (
    <div
      className="bg-white border border-gray-300 w-full max-w-3xl mx-auto my-6 p-6 rounded-lg shadow-lg"
      key={index}
    >
      <div className="mb-6"> 
        <p className="text-lg text-gray-600 font-bold">
          <span>Average: </span>
          <span className={moyenneClass}>{moyenne}</span>
        </p>
        <p className="text-lg text-gray-600 font-bold">
          <span>Credits: </span>
          <span className={moyenneClass}>{creditAcquis}</span>
        </p>
      </div>
      <div>
        {bilanUes.map((ue: any, ueIndex: any) => {
          const ueAverageClass =
            ue.moyenne >= 10.0 ? "text-green-600" : "text-red-600";
          return (
            <div
              key={ueIndex}
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg capitalize"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                UE: {ue.ueLibelleFr}
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
                      ? "text-green-600"
                      : "text-red-600";
                  return (
                    <div
                      key={mcIndex}
                      className="mb-4 p-3 border border-blue-200 rounded-lg"
                    >
                      <h4 className="text-lg font-semibold text-blue-700 mb-1">
                        Module: {mc.mcLibelleFr}
                      </h4>
                      <p className="text-gray-700">
                        <span className="font-semibold">Module Average: </span>
                        <span className={`${mcAverageClass} font-bold`}>
                          {mc.moyenneGenerale}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default async function YearsPage() {
  const dias = await getDias();
  return <>{dias ? <YearsTabs dias={dias} /> : "hello"}</>;
}

const YearsTabs = ({ dias }: any) => {
  "use client";
  return (
    <TabGroup className="flex flex-col md:flex-row gap-3 p-4 w-full min-h-screen">
      <TabList className="flex flex-row md:flex-col gap-2 justify-start mb-4 md:mb-0 overflow-x-auto md:overflow-x-visible">
        {dias.map((dia: any, index: any) => (
          <Tab
            key={index}
            className="rounded-lg px-4 py-2 text-lg md:text-2xl font-semibold transition data-[selected]:bg-green-600 data-[selected]:text-white bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-700"
          >
            {dia.anneeAcademiqueCode}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="flex flex-1 rounded-lg px-4 py-2 border border-green-600">
        {dias.map((dia: any, index: any) => (
          <TabPanel
            key={index}
            className="flex flex-col gap-2 flex-1 justify-center items-center"
          >
            <p className="text-center text-2xl md:text-3xl font-bold text-gray-800 border-b-2 border-green-600 pb-2 capitalize">
              {dia.niveauLibelleLongLt} - {dia.ofLlFiliere}
              {dia.ofLlSpecialite && " - " + dia.ofLlSpecialite}
            </p>
            <div className="flex flex-1">
              <PeriodTab id={dia.id} />
            </div>
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};
