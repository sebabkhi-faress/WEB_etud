import { cookies } from "next/headers";
import axios from "axios";

const getGroup = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const dias = cookieStore.get("dias")?.value as string;
  const dia = JSON.parse(dias)[0];
  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/dia/${dia.id}/groups`,
      {
        headers: {
          Authorization: token
        },
        timeout: 10000,
      }
    );
    console.log("group fetched successfully");
    console.log(res.data);
  } catch (error) {
    console.error("Error fetching image");
    throw Error("Error fetching profile data");
  }
};

export const metadata = {
  title: "WebEtu - Group",
};
export default async function Group() {
  const dia = await getGroup();
  return (
    <div className="bg-gray-300 border-2 border-green-700 w-full h-max max-w-3xl m-5 p-8 flex flex-col gap-8 rounded-lg shadow-2xl box-border">
      Group
    </div>
  );
}
