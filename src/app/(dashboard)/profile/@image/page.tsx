import { cookies } from "next/headers";
import Image from "next/image";
import axios from "axios";

const getImage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const uuid = cookieStore.get("uuid")?.value;
  try {
    const image = await axios.get(
      `https://progres.mesrs.dz/api/infos/image/${uuid}`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 10000, // Timeout set to 10 seconds
      }
    );
    console.log("Image fetched successfully");
    return image.data;
  } catch (error) {
    console.error("Error fetching image");
    throw Error("Error fetching profile data");
  }
};

export default async function ProfileImage() {
  const image = await getImage();
  return (
    <Image
      src={`data:image/png;base64,${image}`}
      alt="Profile Image"
      width={140}
      height={140}
      className="w-28 h-28 md:w-32 md:h-32 rounded-full aspect-square border-2 border-green-700 shadow-lg mb-4 sm:mb-0"
    />
  );
}
