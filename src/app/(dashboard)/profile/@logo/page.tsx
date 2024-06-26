import { cookies } from "next/headers";
import Image from "next/image";
import axios from "axios";

const getLogo = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const EtabId = cookieStore.get("EtabId")?.value;
  try {
    const image = await axios.get(
      `https://progres.mesrs.dz/api/infos/logoEtablissement/${EtabId}`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 10000, // Timeout set to 10 seconds
      }
    );
    console.log("Logo fetched successfully");
    return image.data;
  } catch (error) {
    console.error("Error fetching logo");
    throw Error("Error fetching profile data");
  }
};

export default async function ProfileImage() {
  const logo = await getLogo();
  return (
    <Image
      src={`data:image/png;base64,${logo}`}
      alt="University Logo"
      width={140}
      height={140}
    />
  );
}
