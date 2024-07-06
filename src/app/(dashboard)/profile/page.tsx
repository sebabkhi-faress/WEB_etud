import { cookies } from "next/headers";
import axios from "axios";
import logger from "@/utils";
import cache from "@/cache";
import Image from "next/image";

export const metadata = {
  title: "WebEtu - Profile",
};

const getProfileData = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value;
  const uuid = cookieStore.get("uuid")?.value;

  const cacheKey = `profile-${user}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info("profile cache hit", user, "/profile");
    return cachedData;
  }

  const parseData = (responseData: any) => {
    return {
      individuId: responseData.individuId,
      nin: responseData.nin,
      individuNomArabe: responseData.individuNomArabe,
      individuNomLatin: responseData.individuNomLatin,
      individuPrenomArabe: responseData.individuPrenomArabe,
      individuPrenomLatin: responseData.individuPrenomLatin,
      individuDateNaissance: responseData.individuDateNaissance,
      individuLieuNaissance: responseData.individuLieuNaissance,
      individuLieuNaissanceArabe: responseData.individuLieuNaissanceArabe,
      llEtablissementArabe: responseData.llEtablissementArabe,
      llEtablissementLatin: responseData.llEtablissementLatin,
      niveauLibelleLongLt: responseData.niveauLibelleLongLt,
      ofLlDomaine: responseData.ofLlDomaine,
      ofLlSpecialite: responseData.ofLlSpecialite,
    };
  };

  try {
    const response = await axios.get(
      `https://progres.mesrs.dz/api/infos/bac/${uuid}/dias`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 10000, // Timeout set to 10 seconds
      }
    );

    logger.info("Profile data fetched successfully", user, "/profile");
    const data = parseData(response.data[0]);
    cache.set(cacheKey, data);

    return data;
  } catch (error) {
    logger.error("Error fetching profile data", user, "/profile");
    throw new Error("Error fetching profile data");
  }
};
const getImage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const uuid = cookieStore.get("uuid")?.value;
  const user = cookieStore.get("user")?.value;

  const cacheKey = `image-${user}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info("Image cache hit", user, "/profile");
    return cachedData;
  }

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

    logger.info("Image fetched successfully", user, "/profile");
    cache.set(cacheKey, image.data);
    return image.data;
  } catch (error) {
    logger.error("Error fetching image", user, "/profile");
    return null;
  }
};

const getLogo = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value;
  const EtabId = cookieStore.get("EtabId")?.value;

  const cacheKey = `logo-${EtabId}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info("logo cache hit", user, "/profile");
    return cachedData;
  }

  try {
    const logo = await axios.get(
      `https://progres.mesrs.dz/api/infos/logoEtablissement/${EtabId}`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 10000, // Timeout set to 10 seconds
      }
    );

    logger.info("Logo fetched successfully", user, "/profile");
    cache.set(cacheKey, logo.data);
    return logo.data;
  } catch (error) {
    logger.error("Error fetching logo", user, "/profile");
    return null;
  }
};

const Layout = async () => {
  let [profileData, image, logo] = await Promise.all([
    getProfileData() as any,
    getImage(),
    getLogo(),
  ]);

  const formattedDate = new Date(
    profileData.individuDateNaissance
  ).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gray-300 border-2 border-green-700 w-full h-max max-w-3xl m-5 p-8 flex flex-col gap-8 rounded-lg shadow-2xl box-border">
      <div className="text-center flex justify-between items-center">
        <div className="transition duration-300 ease-in-out transform hover:scale-105">
          <Image
            src={image ? `data:image/png;base64,${image}` : "/unavailable.png"}
            alt="Profile Image"
            width={140}
            height={140}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full aspect-square border-2 border-green-700 shadow-lg mb-4 sm:mb-0"
          />
        </div>
        <div className="transition duration-300 ease-in-out transform hover:scale-105 relative flex items-center justify-center">
          <Image
            src={logo ? `data:image/png;base64,${logo}` : "/unavailable.png"}
            alt="University Logo"
            width={140}
            height={140}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full"
          />
        </div>
      </div>
      <ul className="list-none flex flex-col gap-4">
        <li className="text-lg w-full flex flex-col gap-2">
          <span className="font-bold text-gray-600">First Name:</span>
          <span className="text-gray-800 border-2 border-black bg-white px-4 py-2 rounded-lg capitalize">
            {profileData.individuPrenomLatin}
          </span>
        </li>
        <li className="text-lg w-full flex flex-col gap-2">
          <span className="font-bold text-gray-600">Last Name:</span>
          <span className="text-gray-800 border-2 border-black bg-white px-4 py-2 rounded-lg capitalize">
            {profileData.individuNomLatin}
          </span>
        </li>
        <li className="text-lg w-full flex flex-col gap-2">
          <span className="font-bold text-gray-600">University:</span>
          <span className="text-gray-800 border-2 border-black bg-white px-4 py-2 rounded-lg capitalize">
            {profileData.llEtablissementLatin}
          </span>
        </li>
        <li className="text-lg w-full flex flex-col gap-2">
          <span className="font-bold text-gray-600">Date Of Birth:</span>
          <span className="text-gray-800 border-2 border-black bg-white px-4 py-2 rounded-lg capitalize">
            {formattedDate}
          </span>
        </li>
        <li className="text-lg w-full flex flex-col gap-2">
          <span className="font-bold text-gray-600">Place Of Birth:</span>
          <span className="text-gray-800 border-2 border-black bg-white px-4 py-2 rounded-lg capitalize">
            {profileData.individuLieuNaissance}
          </span>
        </li>
        <li className="text-lg w-full flex flex-col gap-2">
          <span className="font-bold text-gray-600">Field:</span>
          <span className="text-gray-800 border-2 border-black bg-white px-4 py-2 rounded-lg">
            {profileData.ofLlDomaine}
          </span>
        </li>
        <li className="text-lg w-full flex flex-col gap-2">
          <span className="font-bold text-gray-600">Level:</span>
          <span className="text-gray-800 border-2 border-black bg-white px-4 py-2 rounded-lg">
            {profileData.niveauLibelleLongLt} - {profileData.ofLlSpecialite}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Layout;
