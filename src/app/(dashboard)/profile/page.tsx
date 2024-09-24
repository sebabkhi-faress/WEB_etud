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
    <div className="bg-gray-200 border border-gray-900 w-full h-max max-w-3xl mx-auto my-10 p-8 rounded-lg shadow-lg">
      <div className="text-center flex justify-between items-center mb-8">
        <div className="transition-transform duration-300 ease-in-out transform hover:scale-110">
          <Image
            src={image ? `data:image/png;base64,${image}` : "/unavailable.png"}
            alt="Profile Image"
            width={140}
            height={140}
            className="w-32 h-32 rounded-full shadow-md"
          />
        </div>
        <div className="transition-transform duration-300 ease-in-out transform hover:scale-110 relative flex items-center justify-center">
          <Image
            src={logo ? `data:image/png;base64,${logo}` : "/unavailable.png"}
            alt="University Logo"
            width={140}
            height={140}
            className="w-32 h-32 rounded-full"
          />
        </div>
      </div>

      <ul className="list-none flex flex-col gap-6">
        <li className="text-lg flex flex-col gap-1">
          <span className="font-semibold text-gray-700">First Name:</span>
          <span className="text-gray-800 border border-gray-300 bg-gray-50 px-5 py-3 rounded-lg shadow-sm capitalize">
            {profileData.individuPrenomLatin}
          </span>
        </li>
        <li className="text-lg flex flex-col gap-1">
          <span className="font-semibold text-gray-700">Last Name:</span>
          <span className="text-gray-800 border border-gray-300 bg-gray-50 px-5 py-3 rounded-lg shadow-sm capitalize">
            {profileData.individuNomLatin}
          </span>
        </li>
        <li className="text-lg flex flex-col gap-1">
          <span className="font-semibold text-gray-700">University:</span>
          <span className="text-gray-800 border border-gray-300 bg-gray-50 px-5 py-3 rounded-lg shadow-sm capitalize">
            {profileData.llEtablissementLatin}
          </span>
        </li>
        <li className="text-lg flex flex-col gap-1">
          <span className="font-semibold text-gray-700">Date Of Birth:</span>
          <span className="text-gray-800 border border-gray-300 bg-gray-50 px-5 py-3 rounded-lg shadow-sm capitalize">
            {formattedDate}
          </span>
        </li>
        <li className="text-lg flex flex-col gap-1">
          <span className="font-semibold text-gray-700">Place Of Birth:</span>
          <span className="text-gray-800 border border-gray-300 bg-gray-50 px-5 py-3 rounded-lg shadow-sm capitalize">
            {profileData.individuLieuNaissance}
          </span>
        </li>
        <li className="text-lg flex flex-col gap-1">
          <span className="font-semibold text-gray-700">Field:</span>
          <span className="text-gray-800 border border-gray-300 bg-gray-50 px-5 py-3 rounded-lg shadow-sm">
            {profileData.ofLlDomaine}
          </span>
        </li>
        <li className="text-lg flex flex-col gap-1">
          <span className="font-semibold text-gray-700">Level:</span>
          <span className="text-gray-800 border border-gray-300 bg-gray-50 px-5 py-3 rounded-lg shadow-sm">
            {profileData.niveauLibelleLongLt} - {profileData.ofLlSpecialite}
          </span>
        </li>
      </ul>
    </div>
  )
}

export default Layout
