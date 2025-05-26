// "use client"

import Image from "next/image"
import { getProfileData, getLogo, getImage } from "@/utils/api/profile"
import ErrorComponent from "@/components/ErrorComponent"
import ProfileLoadingPage from "./loading"
import { cookies } from 'next/headers';
import { decode } from 'jsonwebtoken';

export const metadata = {
  title: "WebEtu - Profile",
}

const ProfilePage = async () => {
  console.log("Rendering ProfilePage with full details (Manual Decode)...");

  // Read necessary cookies directly on the server
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  const uuid = cookieStore.get('uuid')?.value;
  const studentRegistrationNumber = cookieStore.get('studentRegistrationNumber')?.value;
  
  // Manually decode the token to get user and EtabId
  let EtabId: number | undefined;
  let userFromToken: string | undefined;

  if (token) {
    try {
      const tokenPayload = decode(token) as any;
      if (tokenPayload && typeof tokenPayload === "object") {
        userFromToken = tokenPayload.userName as string;
        EtabId = tokenPayload.idEtablissement as number;
        console.log("User from token payload (manual decode):", userFromToken); // Log user from token
        console.log("EtabId from token payload (manual decode):", EtabId); // Log EtabId from token
      } else {
        console.error("Invalid token payload:", tokenPayload);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      // Handle token decoding errors, e.g., redirect to login
       return <ErrorComponent error="Failed to decode authentication token." />;
    }
  } else {
      console.error("Token cookie not found.");
      // Handle missing token, e.g., redirect to login
       return <ErrorComponent error="Authentication token not found." />;
  }

  console.log("Student Registration Number from cookie (read on Server Profile page):", studentRegistrationNumber);

  // Check if essential cookies/data are available before fetching profile data
  if (!token || !uuid || EtabId === undefined || !userFromToken) {
      console.error("Missing essential data after decoding.", { token: !!token, uuid: !!uuid, EtabId: EtabId !== undefined, userFromToken: !!userFromToken });
      return <ErrorComponent error="Missing essential authentication data after decoding." />;
  }

  // Fetch profile data, image, and logo, passing the cookie values
  let getProfileResponse: any, image: string | null, logo: string | null;
  try {
    [getProfileResponse, image, logo] = await Promise.all([
      getProfileData(token, userFromToken, uuid), // Pass token, user, uuid
      getImage(token, userFromToken, uuid), // Pass token, user, uuid
      getLogo(token, userFromToken, EtabId), // Pass token, user, EtabId
    ]);
    console.log("Fetched data:", { getProfileResponse, image, logo });
  } catch (error) {
    console.error("Error fetching initial profile data:", error);
    getProfileResponse = { success: false, error: "Failed to fetch initial data" };
    image = null;
    logo = null;
  }

  const liStyle = "flex flex-col justify-start items-start text-sm md:text-base gap-2"
  const keySpanStyle = "font-semibold text-gray-600 text-sm"
  const dataSpanStyle = "text-gray-800 p-3 bg-white rounded-lg w-full border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-300"

  if (!getProfileResponse) {
    console.log("No getProfileResponse, showing loading page.");
    return <ProfileLoadingPage />
  }

  if (getProfileResponse.success) {
    console.log("Profile data fetch successful.");
    const profileData = getProfileResponse.data

    const formattedDate = new Date(
      profileData.individuDateNaissance.substring(0, 10),
    ).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 md:p-8">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
          {/* Header with images */}
          <div className="relative bg-gradient-to-r from-green-50 to-green-100 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-200 rounded-full blur-md opacity-50"></div>
                  <Image
                    src={image ? `data:image/png;base64,${image}` : "/images/unavailable.png"}
                    alt="Profile Image"
                    width={140}
                    height={140}
                    className="relative rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-800">
                  {profileData.individuPrenomLatin} {profileData.individuNomLatin}
                </h2>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-200 rounded-full blur-md opacity-50"></div>
                  <Image
                    src={logo ? `data:image/png;base64,${logo}` : "/images/unavailable.png"}
                    alt="University Logo"
                    width={120}
                    height={120}
                    className="relative rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-700">University Logo</h3>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-8 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className={liStyle}>
                  <span className={keySpanStyle}>Student ID (From Login)</span>
                  <span className={dataSpanStyle}>
                    {studentRegistrationNumber || 'N/A'} {/* Display only the cookie value */}
                  </span>
                </div>
                <div className={liStyle}>
                  <span className={keySpanStyle}>First Name</span>
                  <span className={dataSpanStyle}>{profileData.individuPrenomLatin}</span>
                </div>
                <div className={liStyle}>
                  <span className={keySpanStyle}>Last Name</span>
                  <span className={dataSpanStyle}>{profileData.individuNomLatin}</span>
                </div>
              </div>

              <div className="space-y-4">
                {profileData.individuEmail && (
                  <div className={liStyle}>
                    <span className={keySpanStyle}>Email</span>
                    <span className={`${dataSpanStyle} uppercase`}>{profileData.individuEmail}</span>
                  </div>
                )}
                <div className={liStyle}>
                  <span className={keySpanStyle}>Date of Birth</span>
                  <span className={dataSpanStyle}>{formattedDate}</span>
                </div>
                <div className={liStyle}>
                  <span className={keySpanStyle}>Place of Birth</span>
                  <span className={dataSpanStyle}>{profileData.individuLieuNaissance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    console.error("Profile data fetch failed:", getProfileResponse.error);
    return (
      getProfileResponse.error && (
        <ErrorComponent error={getProfileResponse.error} />
      )
    )
  }
}

export default ProfilePage
