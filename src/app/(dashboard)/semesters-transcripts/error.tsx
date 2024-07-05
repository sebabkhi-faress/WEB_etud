"use client";

export default function TranscriptsError({ error }: { error: Error }) {
  return <>{error.message}</>;
}
