import { cookies } from "next/headers";
import axios from "axios";
import logger from "@/utils";
import cache from "@/cache";

export const metadata = {
  title: "WebEtu - Semesters Academic Transcript",
};

const getCookieData = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value;
  const dias = cookieStore.get("dias")?.value as string;
  const dia = JSON.parse(dias)[0];

  return { token, user, dia };
};

// Fetch academic results from the API or cache
const getAcademicResults = async () => {
  const { token, user, dia } = getCookieData();
  const cacheKey = `semesters-transcripts-${user}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info("Semesters Transcripts Cache Hit", user, "/semesters-transcripts");
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
    logger.info("Fetched Semesters Academic Results Successfully", user, "/transcripts");
    cache.set(cacheKey, data);

    return data;
  } catch (error) {
    logger.error("Error Fetching Semesters Academic Results", token, dia);
    throw new Error("Error Fetching Semesters Academic Results");
  }
};

const renderResultItem = (result, index) => {
  const { moyenne, creditAcquis, bilanUes } = result;
  const moyenneClass = moyenne >= 10.0 ? "text-green-600" : "text-red-600";

  return (
    <div
      className="bg-gray-300 border-2 border-green-700 w-full max-w-3xl mx-auto my-5 p-8 rounded-lg shadow-2xl"
      key={index}
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold">
          <span className="font-bold">Average:</span> <span className={moyenneClass}>{moyenne}</span>
        </h2>
        <h2 className="text-2xl font-bold">
          <span className="font-bold">Credits: {creditAcquis}</span>
        </h2>
      </div>
      <div>
        {bilanUes.map((ue, ueIndex) => {
          const ueAverageClass = ue.moyenne >= 10.0 ? "text-green-600" : "text-red-600";
          return (
            <div key={ueIndex} className="mb-4">
              <h3 className="text-xl font-semibold">
                UE: {ue.ueLibelleFr} ({ue.ueCode})
              </h3>
              <p className="text-md">
                <span className="font-bold">Average:</span> <span className={`${ueAverageClass} font-bold`}>{ue.moyenne}</span>
              </p>
              <div className="ml-6">
                {ue.bilanMcs.map((mc, mcIndex) => {
                  const mcAverageClass = mc.moyenneGenerale >= 10.0 ? "text-green-600" : "text-red-600";
                  return (
                    <div key={mcIndex} className="mb-2">
                      <h4 className="text-lg font-semibold">
                        MC: {mc.mcLibelleFr} ({mc.mcCode})
                      </h4>
                      <p className="text-md">
                        <span className="font-bold">Average:</span> <span className={`${mcAverageClass} font-bold`}>{mc.moyenneGenerale}</span>
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

// Main component to display academic results
export default async function AcademicResults() {
  const results = await getAcademicResults();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {results.map((result, index) => renderResultItem(result, index))}
      </div>
    </div>
  );
}
