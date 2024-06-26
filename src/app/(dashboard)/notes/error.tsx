"use client";

export default function ProfileError({ error }: { error: Error }) {
  return <>{error.message}</>;
}
