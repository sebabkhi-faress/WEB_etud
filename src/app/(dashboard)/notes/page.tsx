import { cookies } from "next/headers";
import axios from "axios";

export const metadata = {
  title: "WebEtu - Notes",
};

const getTdTp = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const dias = cookieStore.get("dias")?.value as string;
  const dia = JSON.parse(dias)[0];
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
    const semesters = {} as any;
    res.data.forEach((item: any) => {
      const { llPeriode, ...rest } = item;

      if (!semesters[llPeriode]) {
        semesters[llPeriode] = [];
      }

      semesters[llPeriode].push(rest);
    });

    const sortObjectKeysAlphabetically = (obj: any) => {
      return Object.keys(obj)
        .sort()
        .reduce((sortedObj: any, key) => {
          sortedObj[key] = obj[key];
          return sortedObj;
        }, {});
    };
    return sortObjectKeysAlphabetically(semesters);
  } catch (error) {
    console.error("Error fetching tp and td info\n", error);
  }
};

export default async function Notes() {
  const semesterInfo = await getTdTp();
  return (
    <div className="bg-gray-300 border-2 border-green-700 w-full h-max max-w-3xl m-5 p-8 flex flex-col gap-8 rounded-lg shadow-2xl box-border">
      {Object.entries(semesterInfo).map(([semester, items]: any) => (
        <div className="flex flex-col gap-4" key={semester}>
          <h2 className="text-center text-3xl">{semester}</h2>
          {items.map((item: any) => (
            <div
              className={`rounded-lg p-4 flex justify-between ${
                item.note >= 10
                  ? "bg-green-200 text-green-700"
                  : "bg-red-200 text-red-700"
              }`}
              key={item.id}
            >
              <p>{item.rattachementMcMcLibelleFr}</p>
              <p>{item.note}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
