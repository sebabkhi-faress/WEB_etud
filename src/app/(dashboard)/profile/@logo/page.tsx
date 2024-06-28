import { cookies } from "next/headers";
import Image from "next/image";
import axios from "axios";
import logger from "@/utils";

const getLogo = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value;
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
    logger.info("Logo fetched successfully", user, "/profile");
    return image.data;
  } catch (error) {
    logger.error("Error fetching logo", user, "/profile");
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
      className="w-28 h-28 md:w-32 md:h-32"
    />
  );
}
