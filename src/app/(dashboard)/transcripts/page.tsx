import { cookies } from "next/headers";
import axios from "axios";
import logger from "@/utils";
import cache from "@/cache";

export const metadata = {
  title: "Academic Results",
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
  const cacheKey = `transcripts-${user}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info("Transcripts Cache Hit", user, "/transcripts");
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
    logger.info("Fetched Academic Results Successfully", user, "/transcripts");
    cache.set(cacheKey, data);

    return data;
  } catch (error) {
    logger.error("Error Fetching Academic Results", token, dia);
    throw new Error("Error Fetching Academic Results");
  }
};

const renderResultItem = (result, index) => {
  const { moyenne, typeDecisionLibelleFr, creditAcquis } = result;
  const averageClass = moyenne >= 10.0 ? "text-green-700" : "text-red-700";

  return (
    <div
      className="bg-gray-300 border-2 border-green-700 w-full max-w-3xl mx-auto my-5 p-8 rounded-lg shadow-2xl"
      key={index}
    >
      <p className="font-semibold text-lg mb-2">Average: <span className={averageClass}>{moyenne}</span></p>
      <p className="font-semibold text-lg mb-2">Decision: <span className={averageClass}>{typeDecisionLibelleFr}</span></p>
      <p className="font-semibold text-lg mb-2">Credits: {creditAcquis}</p>
    </div>
  );
};

// Main component to display academic results
export default async function AcademicResults() {
  const results = await getAcademicResults();

  return (
    <div className="px-4 md:px-0">
      {results.map((result, index) => renderResultItem(result, index))}
    </div>
  );
}
