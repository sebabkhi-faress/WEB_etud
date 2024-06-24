"use client";

const Profile = () => {
  return (
    <div className="bg-gray-300 border-2 border-green-700 w-11/12 max-w-3xl m-5 p-8 rounded-lg shadow-2xl box-border">
      <div className="text-center mb-8">
        <div className="rounded-full w-[140px] aspect-square border-2 border-green-700 bg-gray-200 shadow-lg mx-auto mb-8" />
      </div>
      <div className="text-left">
        <ul className="list-none p-0 m-0">
          <li className="mb-4 text-lg text-gray-800">
            <span className="font-bold text-gray-600">First Name: </span>
          </li>
          <li className="mb-4 text-lg text-gray-800">
            <span className="font-bold text-gray-600">Last Name: </span>
          </li>
          <li className="mb-4 text-lg text-gray-800">
            <span className="font-bold text-gray-600">University: </span>
          </li>
          <li className="mb-4 text-lg text-gray-800">
            <span className="font-bold text-gray-600">Date Of Birth: </span>
          </li>
          <li className="mb-4 text-lg text-gray-800">
            <span className="font-bold text-gray-600">Place Of Birth: </span>
          </li>
          <li className="mb-4 text-lg text-gray-800">
            <span className="font-bold text-gray-600">Field: </span>
          </li>
          <li className="mb-4 text-lg text-gray-800">
            <span className="font-bold text-gray-600">Level: </span>
          </li>
        </ul>
        <div className="text-center mt-8">
          <div className="mx-auto w-[140px] rounded-full aspect-square border-2 bg-gray-200 shadow-lg mb-8" />
        </div>
      </div>
    </div>
  );
};

export default Profile;
