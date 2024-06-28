import { cookies } from "next/headers";
import axios from "axios";
import logger from "@/utils";

const getProfileData = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value;
  const uuid = cookieStore.get("uuid")?.value;

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

    return data;
  } catch (error) {
    logger.error("Error fetching profile data", user, "/profile");
    throw new Error("Error fetching profile data");
  }
};

const Profile = async () => {
  const profileData = await getProfileData();

  return (
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
          {profileData.individuDateNaissance}
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
  );
};

export default Profile;
