import { cookies } from "next/headers";
import Image from "next/image";
import axios from "axios";

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;
const uuid = cookieStore.get("uuid")?.value;

const getProfileData = async () => {
  try {
    const profileData = await axios.get(
      `https://progres.mesrs.dz/api/infos/bac/${uuid}/dias`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return profileData.data;
  } catch (error) {
    console.error('Error fetching profile data: ', error);
    return {}; // Return empty object or default value
  }
};

const getImage = async () => {
  try {
    const image = await axios.get(
      `https://progres.mesrs.dz/api/infos/image/${uuid}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return image.data;
  } catch (error) {
    console.error('Error fetching image: ', error);
    return ''; // Return empty string or default value
  }
};

const getLogo = async (refEtablissementId) => {
  try {
    const image = await axios.get(
      `https://progres.mesrs.dz/api/infos/logoEtablissement/${refEtablissementId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return image.data;
  } catch (error) {
    console.error('Error fetching logo: ', error);
    return ''; // Return empty string or default value
  }
};

const Profile = async () => {
  try {
    const profileData = await getProfileData();
    const image = await getImage();

    if (!profileData || !profileData[0]) {
      throw new Error('Profile data not available.');
    }

    const logo = await getLogo(profileData[0].refEtablissementId);

    return (
      <div className="bg-gray-300 border-2 border-green-700 w-11/12 max-w-3xl m-5 p-8 rounded-lg shadow-2xl box-border">
        <div className="text-center mb-8">
          <Image
            src={`data:image/png;base64,${image}`}
            alt="Profile Image"
            width={140}
            height={200}
            className="rounded-full aspect-square border-2 border-green-700 shadow-lg mx-auto mb-8"
          />
        </div>
        <div className="text-left">
          <ul className="list-none p-0 m-0">
            <li className="mb-4 text-lg text-gray-800">
              <span className="font-bold text-gray-600">First Name: </span>
              {profileData[0].individuPrenomLatin}
            </li>
            <li className="mb-4 text-lg text-gray-800">
              <span className="font-bold text-gray-600">Last Name: </span>
              {profileData[0].individuNomLatin}
            </li>
            <li className="mb-4 text-lg text-gray-800">
              <span className="font-bold text-gray-600">University: </span>{" "}
              {profileData[0].llEtablissementLatin}
            </li>
            <li className="mb-4 text-lg text-gray-800">
              <span className="font-bold text-gray-600">Date Of Birth: </span>
              {profileData[0].individuDateNaissance}
            </li>
            <li className="mb-4 text-lg text-gray-800">
              <span className="font-bold text-gray-600">Place Of Birth: </span>
              {profileData[0].individuLieuNaissance}
            </li>
            <li className="mb-4 text-lg text-gray-800">
              <span className="font-bold text-gray-600">Field: </span>
              {profileData[0].ofLlDomaine}
            </li>
            <li className="mb-4 text-lg text-gray-800">
              <span className="font-bold text-gray-600">Level: </span>
              {profileData[0].niveauLibelleLongLt}
            </li>
            {/* Add more key-value pairs as needed */}
          </ul>
        </div>

        <div className="text-center mt-8">
          <Image
            src={`data:image/png;base64,${logo}`}
            alt="University Logo"
            width={140}
            height={200}
            className="mx-auto"
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in Profile component: ', error);
    return (
      <div className="bg-red-200 p-4">
        <p>Failed to load profile data. Please try again later.</p>
      </div>
    );
  }
};  

export default Profile;