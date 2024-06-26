import { cookies } from "next/headers";
import axios, { AxiosHeaderValue } from "axios";

const getGroup = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const dias = cookieStore.get("dias")?.value as string;
  const dia = JSON.parse(dias)[3];
  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/dia/${dia.id}/groups`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 100000,
      }
    );

    const semesterInfo = {} as any;
    res.data
      .sort((a: any, b: any) => a.periodeId - b.periodeId)
      .forEach((item: any) => {
        if (!item.nomSection) return;
        const semesterKey = item.periodeLibelleLongLt;
        const group = item.nomGroupePedagogique;
        const section =
          item.nomSection === "Section" ? "Section 1" : item.nomSection;
        semesterInfo[semesterKey] = { group, section };
      });

    console.log(semesterInfo);
    return semesterInfo;
  } catch (error) {
    console.error("Error fetching group and section info\n", error);
  }
};

export const metadata = {
  title: "WebEtu - Group",
};
export default async function Group() {
  const semesterInfo = (await getGroup()) as [
    { group: string; section: string }
  ];
  return (
    <div className="bg-gray-300 border-2 border-green-700 w-full h-max max-w-3xl m-5 p-8 flex flex-col gap-8 rounded-lg shadow-2xl box-border">
      {Object.entries(semesterInfo).map(([semester, info]) => (
        <div className="flex flex-col gap-4" key={semester}>
          <h2 className="w-full rounded-lg p-2 text-center bg-green-500 text-white">
            {semester}
          </h2>
          <div className="flex flex-col bg-white text-green-500 rounded-lg p-4">
            <p>Section: {info.section}</p>
            <p>Group: {info.group}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
