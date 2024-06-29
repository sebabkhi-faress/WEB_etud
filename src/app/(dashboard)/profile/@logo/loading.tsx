"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  return (
    <div className="w-28 h-28 md:w-32 md:h-32 flex justify-center items-center rounded-full aspect-square shadow-lg mb-4 sm:mb-0">
      <ArrowPathIcon className="animate-spin h-16 w-16" />
    </div>
  );
};

export default Profile;
