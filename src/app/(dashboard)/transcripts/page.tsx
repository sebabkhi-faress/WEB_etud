import { cookies } from "next/headers";
import axios from "axios";
import logger from "@/utils";
import cache from "@/cache";

export const metadata = {
  title: "WebEtu - Academic Transcripts",
};

const getCookieData = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value;
  const dias = cookieStore.get("dias")?.value as string;
  const dia = JSON.parse(dias)[0];

  return { token, user, dia };
};

const getYearAcademicResults = async () => {
  const { token, user, dia } = getCookieData();
  const cacheKey = `year-transcript-${user}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info("Year Transcript Cache Hit", user, "/transcripts");
    return cachedData;
  }

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/bac/${token}/dia/${dia.id}/annuel/bilan`,
      {
        headers: { Authorization: token },
        timeout: 10000,
      }
    );

    const data = res.data;
    logger.info(
      "Fetched Year Academic Results Successfully",
      user,
      "/transcripts"
    );
    cache.set(cacheKey, data);

    return data;
  } catch (error) {
    logger.error("Error Fetching Year Academic Results", token, dia);
    throw new Error("Error Fetching Year Academic Results");
  }
};

let selectedSemester : number;
const getSemesterAcademicResults = async () => {
  const { token, user, dia } = getCookieData();
  const cacheKey = `semesters-transcripts-${user}`;
  const cachedData = cache.get(cacheKey);

  selectedSemester = 2;

  if (cachedData) {
    logger.info("Semesters Transcripts Cache Hit", user, "/transcripts");
    return cachedData;
  }

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/bac/${token}/dias/${dia.id}/periode/bilans`,
      {
        headers: { Authorization: token },
        timeout: 10000,
      }
    );

    const data = res.data;
    logger.info(
      "Fetched Semesters Academic Results Successfully",
      user,
      "/transcripts"
    );
    cache.set(cacheKey, data);

    return data;
  } catch (error) {
    logger.error("Error Fetching Semesters Academic Results", token, dia);
    throw new Error("Error Fetching Semesters Academic Results");
  }
};

const renderYearResultItem = (result: any, index: any) => {
  const { moyenne, typeDecisionLibelleFr, creditAcquis } = result;
  const averageClass = moyenne >= 10.0 ? "text-green-700" : "text-red-700";

  return (
    <div
      className="bg-white border border-gray-300 w-full max-w-3xl mx-auto my-6 p-6 rounded-lg shadow-lg"
      key={index}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Annual Result
      </h2>
      <p className="text-lg text-gray-700 mb-2 font-semibold">
        <span>Average Annual: </span>
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
  const semesterLabel = selectedSemester === 2 ? "Semester 2" : "Semester 1";

  if (selectedSemester === 2) selectedSemester--; // Keeping this as per your comment

  return (
    <div
      className="bg-white border border-gray-300 w-full max-w-3xl mx-auto my-6 p-6 rounded-lg shadow-lg"
      key={index}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {semesterLabel} Results
        </h2>
        <p className="text-lg text-gray-600 font-semibold">
          <span>Average: </span>
          <span className={moyenneClass}>{moyenne}</span>
        </p>
        <p className="text-lg text-gray-600 font-semibold">
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
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                {ue.ueNatureLcFr}: {ue.ueLibelleFr}
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                <span className="font-semibold">Average: </span>
                <span className={`${ueAverageClass} font-bold`}>{ue.moyenne}</span>
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

export default async function AcademicResults() {
  const yearResults = await getYearAcademicResults();
  const semesterResults = await getSemesterAcademicResults();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {yearResults.map((result: any, index: any) =>
          renderYearResultItem(result, index)
        )}
      </div>
      <div className="space-y-6">
        {semesterResults.map((result: any, index: any) =>
          renderSemesterResultItem(result, index)
        )}
      </div>
    </div>
  );
}
