"use client";

export default function ExamsError({ error }: { error: Error }) {
  return <>{error.message}</>;
}
