"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  return (
    <div className=" w-[140px] flex justify-center items-center rounded-full aspect-square border-2 border-green-700 shadow-lg mb-4 sm:mb-0">
      <ArrowPathIcon className="animate-spin h-16 w-16" />
    </div>
  );
};

export default Profile;
