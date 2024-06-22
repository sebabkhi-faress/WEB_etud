import Image from "next/image";

const Profile = () => {
  return (
    <div className="bg-gray-100 p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md text-center">
      <div className="bg-gray-100 w-11/12 max-w-3xl m-5 p-8 rounded-lg shadow-2xl box-border">
        <div className="text-center mb-8">
          <Image
            src="/profile-image.jpg"
            alt="Profile Image"
            width={180}
            height={180}
            className="rounded-full border-8 border-green-700 shadow-lg mx-auto mb-8"
          />
        </div>
        <div className="text-left">
          <ul className="list-none p-0 m-0">
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
    </div>
  );
};

export default Profile;
