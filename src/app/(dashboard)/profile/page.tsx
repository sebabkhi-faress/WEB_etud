import Image from "next/image"
import { getProfileData, getLogo, getImage } from "@/api"

export const metadata = {
  title: "WebEtu - Profile",
}

const Layout = async () => {
  let [profileData, image, logo] = await Promise.all([
    getProfileData() as any,
    getImage(),
    getLogo(),
  ])

  const formattedDate = new Date(
    profileData.individuDateNaissance,
  ).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="bg-gray-200 border border-gray-900 w-full h-max max-w-3xl m-5 p-7 flex flex-col gap-8 rounded-lg shadow-5x5 box-border capitalize">
      <div className="text-center flex justify-between items-center">
        <div className="transition duration-300 ease-in-out transform hover:scale-105">
          <Image
            src={image ? `data:image/png;base64,${image}` : "/unavailable.png"}
            alt="Profile Image"
            width={140}
            height={140}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full aspect-square shadow-lg mb-4 sm:mb-0"
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
          <span className="text-gray-800 border border-gray-900 bg-white px-4 py-2 rounded-lg capitalize">
            {profileData.individuPrenomLatin}
          </span>
        </li>
        <li className="text-lg w-full flex flex-col gap-2">
          <span className="font-bold text-gray-600">Last Name:</span>
          <span className="text-gray-800 border border-gray-900 bg-white px-4 py-2 rounded-lg capitalize">
            {profileData.individuNomLatin}
          </span>
        </li>
        <li className="text-lg w-full flex flex-col gap-2">
          <span className="font-bold text-gray-600">University:</span>
          <span className="text-gray-800 border border-gray-900 bg-white px-4 py-2 rounded-lg capitalize">
            {profileData.llEtablissementLatin}
          </span>
        </li>
        <li className="text-lg w-full flex flex-col gap-2">
          <span className="font-bold text-gray-600">Date Of Birth:</span>
          <span className="text-gray-800 border border-gray-900 bg-white px-4 py-2 rounded-lg capitalize">
            {formattedDate}
          </span>
        </li>
        <li className="text-lg w-full flex flex-col gap-2">
          <span className="font-bold text-gray-600">Place Of Birth:</span>
          <span className="text-gray-800 border border-gray-900 bg-white px-4 py-2 rounded-lg capitalize">
            {profileData.individuLieuNaissance}
          </span>
        </li>
        <li className="text-lg w-full flex flex-col gap-2">
          <span className="font-bold text-gray-600">Field:</span>
          <span className="text-gray-800 border border-gray-900 bg-white px-4 py-2 rounded-lg">
            {profileData.ofLlDomaine}
          </span>
        </li>
        <li className="text-lg w-full flex flex-col gap-2">
          <span className="font-bold text-gray-600">Level:</span>
          <span className="text-gray-800 border border-gray-900 bg-white px-4 py-2 rounded-lg">
            {profileData.niveauLibelleLongLt} - {profileData.ofLlSpecialite}
          </span>
        </li>
      </ul>
    </div>
  )
}

export default Layout
