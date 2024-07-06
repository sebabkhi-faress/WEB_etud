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
  const cacheKey = `transcripts-${user}`;
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

const getSemesterAcademicResults = async () => {
  const { token, user, dia } = getCookieData();
  const cacheKey = `semesters-transcripts-${user}`;
  const cachedData = cache.get(cacheKey);

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
      className="bg-gray-300 border-2 border-green-700 w-full max-w-3xl mx-auto my-5 p-8 rounded-lg shadow-lg"
      key={index}
    >
      <p className="font-semibold text-lg mb-2">
        Average: <span className={averageClass}>{moyenne}</span>
      </p>
      <p className="font-semibold text-lg mb-2">
        Decision: <span className={averageClass}>{typeDecisionLibelleFr}</span>
      </p>
      <p className="font-semibold text-lg mb-2">Credits: {creditAcquis}</p>
    </div>
  );
};

let selectedSemester = 2;
const renderSemesterResultItem = (result: any, index: any) => {
  const { moyenne, creditAcquis, bilanUes } = result;
  const moyenneClass = moyenne >= 10.0 ? "text-green-600" : "text-red-600";
  const semesterLabel = selectedSemester === 2 ? "Semester 2" : "Semester 1";

  if (selectedSemester === 2) selectedSemester--; // Not sure about this line, but I'm leaving it as per your code.

  return (
    <div
      className="bg-gray-300 border-2 border-green-700 w-full max-w-3xl mx-auto my-5 p-8 rounded-lg shadow-lg"
      key={index}
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold">
          <span className="font-bold">Average {semesterLabel}: </span>{" "}
          <span className={moyenneClass}>{moyenne}</span>
        </h2>
        <h2 className="text-2xl font-bold">
          <span className="font-bold">Credits: {creditAcquis}</span>
        </h2>
      </div>
      <div>
        {bilanUes.map((ue: any, ueIndex: any) => {
          const ueAverageClass =
            ue.moyenne >= 10.0 ? "text-green-600" : "text-red-600";
          return (
            <div key={ueIndex} className="mb-4">
              <h3 className="text-xl font-semibold">
                <span className="text-blue-600">UE: {ue.ueLibelleFr}</span>
              </h3>
              <p className="text-md">
                <span className="font-bold">Average:</span>{" "}
                <span className={`${ueAverageClass} font-bold`}>
                  {ue.moyenne}
                </span>
              </p>
              <div className="ml-6">
                {ue.bilanMcs.map((mc: any, mcIndex: any) => {
                  const mcAverageClass =
                    mc.moyenneGenerale >= 10.0
                      ? "text-green-600"
                      : "text-red-600";
                  return (
                    <div key={mcIndex} className="mb-2">
                      <h4 className="text-lg font-semibold">
                        <span className="text-purple-600">
                          Module: {mc.mcLibelleFr}
                        </span>
                      </h4>
                      <p className="text-md">
                        <span className="font-bold">Average:</span>{" "}
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
