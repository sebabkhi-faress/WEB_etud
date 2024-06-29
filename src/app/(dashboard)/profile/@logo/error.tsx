"use client";
import Image from "next/image";
// import placeholder from "/public/unavailable.png";
export default function ProfileError({ error }: { error: string }) {
  return (
    <Image
      src="/unavailable.png"
      alt="error"
      width={140}
      height={140}
      className="w-28 h-28 md:w-32 md:h-32 rounded-full aspect-square border-2 border-green-700 shadow-lg mb-4 sm:mb-0"
    />
  );
}
