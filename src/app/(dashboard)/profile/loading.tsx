"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  return (
    <div className="bg-gray-300 border-2 border-green-700 w-full max-w-3xl m-5 p-8 flex justify-center items-center gap-8 rounded-lg shadow-2xl box-border min-h-screen">
      <ArrowPathIcon className="animate-spin h-16 w-16" />
    </div>
  );
};

export default Profile;
