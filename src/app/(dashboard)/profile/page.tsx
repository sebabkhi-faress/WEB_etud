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

  const liStyle = "text-lg w-full flex flex-col gap-2"
  const keySpanStyle = "font-bold text-gray-600"
  const dataSpanStyle =
    "text-gray-800 border border-gray-900 bg-white px-4 py-2 rounded"

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
      <div className="bg-gray-200 border border-gray-400 w-full h-max max-w-3xl m-5 p-7 flex flex-col gap-8 rounded shadow-5x5 box-border capitalize">
        <div className="text-center flex justify-between items-center">
          <div className="transition duration-300 ease-in-out transform hover:scale-105">
            <Image
              src={
                image
                  ? `data:image/png;base64,${image}`
                  : "/images/unavailable.png"
              }
              alt="Profile Image"
              width={140}
              height={140}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full aspect-square shadow-lg mb-4 sm:mb-0"
            />
          </div>
          <div className="transition duration-300 ease-in-out transform hover:scale-105 relative flex items-center justify-center">
            <Image
              src={
                logo
                  ? `data:image/png;base64,${logo}`
                  : "/images/unavailable.png"
              }
              alt="University Logo"
              width={140}
              height={140}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full"
            />
          </div>
        </div>
        <ul className="list-none flex flex-col gap-4">
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
            <span className={keySpanStyle}>Date Of Birth:</span>
            <span className={dataSpanStyle}>{formattedDate}</span>
          </li>
          <li className={liStyle}>
            <span className={keySpanStyle}>Place Of Birth:</span>
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
