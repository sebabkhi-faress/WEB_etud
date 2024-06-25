import { cookies } from "next/headers";
import Image from "next/image";
import axios from "axios";

export const revalidate = 3600;

export const metadata = {
  title: "WebEtu - Profile",
};

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

const Profile = async () => {
  const [profileData, image, logo] = await Promise.all([
    getProfileData(),
    getImage(),
    getLogo(),
  ]);

  return (
    <div className="bg-gray-300 border-2 border-green-700 w-full h-max max-w-3xl m-5 p-8 flex flex-col gap-8 rounded-lg shadow-2xl box-border">
      <div className="text-center flex flex-col sm:flex-row justify-between items-center">
        <Image
          src={`data:image/png;base64,${image}`}
          alt="Profile Image"
          width={140}
          height={140}
          className="rounded-full aspect-square border-2 border-green-700 shadow-lg mb-4 sm:mb-0"
        />
        <Image
          src={`data:image/png;base64,${logo}`}
          alt="University Logo"
          width={140}
          height={140}
        />
      </div>
      <div className="text-left">
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
      </div>
    </div>
  );
};

export default Profile;
