import { cookies } from "next/headers";
import axios from "axios";

const getProfileData = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const uuid = cookieStore.get("uuid")?.value;

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

    console.log("Profile data fetched successfully");

    const data = (({
      individuId,
      nin,
      individuNomArabe,
      individuNomLatin,
      individuPrenomArabe,
      individuPrenomLatin,
      individuDateNaissance,
      individuLieuNaissance,
      individuLieuNaissanceArabe,
      llEtablissementArabe,
      llEtablissementLatin,
      niveauLibelleLongLt,
      ofLlDomaine,
      ofLlSpecialite,
    }) => ({
      individuId,
      nin,
      individuNomArabe,
      individuNomLatin,
      individuPrenomArabe,
      individuPrenomLatin,
      individuDateNaissance,
      individuLieuNaissance,
      individuLieuNaissanceArabe,
      llEtablissementArabe,
      llEtablissementLatin,
      niveauLibelleLongLt,
      ofLlDomaine,
      ofLlSpecialite,
    }))(response.data[0]);

    return data;
  } catch (error) {
    console.error("Error fetching profile data");
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
