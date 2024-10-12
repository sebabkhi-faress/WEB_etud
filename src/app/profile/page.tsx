import Image from "next/image"
import { getProfileData, getLogo, getImage } from "@/utils/api/profile"
import ErrorComponent from "@/components/ErrorComponent"

export const metadata = {
  title: "WebEtu - Profile",
}

const ProfilePage = async () => {
  let [getProfileResponse, image, logo] = await Promise.all([
    getProfileData() as any,
    getImage(),
    getLogo(),
  ])

  const liStyle = "flex justify-between items-center text-sm gap-2"
  const keySpanStyle = "font-medium text-gray-600"
  const dataSpanStyle =
    "text-gray-800 bg-white px-2 py-1 rounded-sm border border-gray-200"

  if (getProfileResponse.success) {
    const profileData = getProfileResponse.data

    const formattedDate = new Date(
      profileData.individuDateNaissance,
    ).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return (
      <div className="bg-white mx-4 md:mx-auto mt-6 p-6 md:p-8 rounded-lg shadow-lg border border-gray-200 capitalize mb-8">
        <div className="flex flex-row items-center justify-center gap-4 mb-6">
          <div className="transition-transform transform hover:scale-105">
            <Image
              src={
                image
                  ? `data:image/png;base64,${image}`
                  : "/images/unavailable.png"
              }
              alt="Profile Image"
              width={120}
              height={120}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full"
            />
          </div>
          {/* University Logo */}
          <div className="transition-transform transform hover:scale-105">
            <Image
              src={
                logo
                  ? `data:image/png;base64,${logo}`
                  : "/images/unavailable.png"
              }
              alt="University Logo"
              width={120}
              height={120}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full"
            />
          </div>
        </div>

        <ul className="space-y-4">
          <li className={liStyle}>
            <span className={keySpanStyle}>First Name:</span>
            <span className={dataSpanStyle}>
              {profileData.individuPrenomLatin}
            </span>
          </li>
          <li className={liStyle}>
            <span className={keySpanStyle}>Last Name:</span>
            <span className={dataSpanStyle}>
              {profileData.individuNomLatin}
            </span>
          </li>
          <li className={liStyle}>
            <span className={keySpanStyle}>University:</span>
            <span className={dataSpanStyle}>
              {profileData.llEtablissementLatin}
            </span>
          </li>
          <li className={liStyle}>
            <span className={keySpanStyle}>Date of Birth:</span>
            <span className={dataSpanStyle}>{formattedDate}</span>
          </li>
          <li className={liStyle}>
            <span className={keySpanStyle}>Place of Birth:</span>
            <span className={dataSpanStyle}>
              {profileData.individuLieuNaissance}
            </span>
          </li>
          <li className={liStyle}>
            <span className={keySpanStyle}>Field:</span>
            <span className={dataSpanStyle}>{profileData.ofLlDomaine}</span>
          </li>
          <li className={liStyle}>
            <span className={keySpanStyle}>Level:</span>
            <span className={dataSpanStyle}>
              {profileData.niveauLibelleLongLt} - {profileData.ofLlSpecialite}
            </span>
          </li>
        </ul>
      </div>
    )
  } else {
    return (
      getProfileResponse.error && (
        <ErrorComponent error={getProfileResponse.error} />
      )
    )
  }
}

export default ProfilePage
