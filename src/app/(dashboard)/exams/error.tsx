"use client";

export default function GroupError({ error }: { error: Error }) {
  return <>{error.message}</>;
}
