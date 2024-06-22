import Image from "next/image";

const Profile = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 rounded-lg shadow-md border-4 border-green-700 w-full max-w-3xl mx-auto text-center">
      <div className="relative rounded-full overflow-hidden border-4 border-green-700 shadow-lg mx-auto mb-8" style={{ width: "180px", height: "180px" }}>
        <Image
          src="/profile-image.jpg"
          alt="Profile Image"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <ul className="text-left list-none p-0 m-0">
        <li className="mb-4 text-lg text-gray-800">
          <span className="font-bold text-gray-600">First Name:</span> Ahmed
        </li>
        <li className="mb-4 text-lg text-gray-800">
          <span className="font-bold text-gray-600">Last Name:</span> Kassas
        </li>
        <li className="mb-4 text-lg text-gray-800">
          <span className="font-bold text-gray-600">Email:</span>{" "}
          test@example.com
        </li>
        <li className="mb-4 text-lg text-gray-800">
          <span className="font-bold text-gray-600">Phone:</span> +123 456 7890
        </li>
        <li className="mb-4 text-lg text-gray-800">
          <span className="font-bold text-gray-600">Location:</span> City, Country
        </li>
        <li className="mb-4 text-lg text-gray-800">
          <span className="font-bold text-gray-600">Occupation:</span> Web Developer
        </li>
        {/* Add more key-value pairs as needed */}
      </ul>
    </div>
  );
};

export default Profile;
