import { cookies } from "next/headers";
import axios from "axios";
import logger from "@/utils";
import cache from "@/cache";

export const metadata = {
  title: "WebEtu - Notes",
};

const getTdTp = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value;
  const dias = cookieStore.get("dias")?.value as string;
  const dia = JSON.parse(dias)[0];

  const cacheKey = `notes-${user}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info("notes cache hit", user, "/notes");
    return cachedData;
  }

  const parseData = (data: any) => {
    const semesters: Record<string, any[]> = {};
    data.forEach((item: any) => {
      const { llPeriode, ...rest } = item;
      semesters[llPeriode] = semesters[llPeriode] || [];
      semesters[llPeriode].push(rest);
    });

    return Object.keys(semesters)
      .sort()
      .reduce((sortedObj: Record<string, any>, key) => {
        sortedObj[key] = semesters[key];
        return sortedObj;
      }, {});
  };

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/controleContinue/dia/${dia.id}/notesCC`,
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

const NoteItem = ({ item }: { item: any }) => (
  <div
    className={`rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center shadow-md transition duration-300 ease-in-out transform hover:scale-105 ${
      item.note >= 10 ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
    }`}
    key={item.id}
    style={{ marginBottom: "0.5rem" }} // Reduced bottom margin to 0.5rem
  >
    <p className="font-semibold">{item.rattachementMcMcLibelleFr}</p>
    <div className="flex gap-4 mt-2 sm:mt-0">
      <p className="font-bold text-lg">{item.note != null ? item.note : "Empty"}</p>
      <p className="font-bold text-lg text-gray-700">{item.apCode}</p>
    </div>
  </div>
);

const SemesterSection = ({ semester, items }: { semester: string; items: any[] }) => (
  <div className="flex flex-col gap-2" key={semester}> {/* Reduced gap to 2 */}
    <h2 className="text-center text-3xl font-bold text-blue-700 border-b-2 border-blue-700 pb-2">
      {semester}
    </h2>
    {items.map((item) => (
      <NoteItem key={item.id} item={item} />
    ))}
  </div>
);

export default async function Notes() {
  const semesterInfo = await getTdTp();
  return (
    <div className="bg-gray-300 border-2 border-green-700 w-full h-max max-w-3xl m-5 p-8 flex flex-col gap-8 rounded-lg shadow-2xl box-border">
      {Object.entries(semesterInfo).map(([semester, items]) => (
        <SemesterSection key={semester} semester={semester} items={items} />
      ))}
    </div>
  );
}
