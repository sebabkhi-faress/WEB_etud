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
      className="rounded-full aspect-square border-2 border-green-700 shadow-lg mb-4 sm:mb-0"
    />
  );
}
