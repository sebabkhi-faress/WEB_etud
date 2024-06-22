import { cookies } from "next/headers";
import Image from "next/image";
import axios from "axios";

const getProfileData = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const uuid = cookieStore.get("uuid")?.value;

  const profileData = await axios.get(
    `https://progres.mesrs.dz/api/infos/bac/${uuid}/dias`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return profileData.data;
};

const getImage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const uuid = cookieStore.get("uuid")?.value;
  const image = await axios.get(
    `https://progres.mesrs.dz/api/infos/image/${uuid}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return image.data;
};

const Profile = async () => {
  const image = await getImage();
  const profileData = await getProfileData();
  console.log(profileData);

  return (
    <div className="bg-gray-100 w-11/12 max-w-3xl m-5 p-8 rounded-lg shadow-2xl box-border">
      <div className="text-center mb-8">
        <Image
          src={`data:image/png;base64,${image}`}
          alt="Profile Image"
          width={180}
          height={180}
          className="rounded-full aspect-square border-8 border-green-700 shadow-lg mx-auto mb-8"
        />
      </div>
      <div className="text-left">
        <ul className="list-none p-0 m-0">
          <li className="mb-4 text-lg text-gray-800">
            <span className="font-bold text-gray-600">First Name:</span>
            {profileData.nomAr}
          </li>
          <li className="mb-4 text-lg text-gray-800">
            <span className="font-bold text-gray-600">Last Name:</span> Kassas
          </li>
          <li className="mb-4 text-lg text-gray-800">
            <span className="font-bold text-gray-600">Email:</span>{" "}
            test@example.com
          </li>
          <li className="mb-4 text-lg text-gray-800">
            <span className="font-bold text-gray-600">Phone:</span> +123 456
            7890
          </li>
          <li className="mb-4 text-lg text-gray-800">
            <span className="font-bold text-gray-600">Location:</span> City,
            Country
          </li>
          <li className="mb-4 text-lg text-gray-800">
            <span className="font-bold text-gray-600">Occupation:</span> Web
            Developer
          </li>
          {/* Add more key-value pairs as needed */}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
