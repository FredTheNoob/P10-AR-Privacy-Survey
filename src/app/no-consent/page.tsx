"use client"

import { useSearchParams } from "next/navigation";

export default function NoConsentPage() {
  const searchParams = useSearchParams();
  const prolificId = searchParams.get("PROLIFIC_PID");

  if (!prolificId) {
    return <p className="flex min-h-screen flex-col items-center justify-center">
      Prolific ID not found in URL. Please access the survey through the Prolific link provided to you.
    </p>
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl text-center space-y-4">
        <h1 className="text-3xl font-semibold">Thank you for participating</h1>
        <p className="text-gray-700">
          Your responses have been submitted successfully.
        </p>
        <button
          type="submit"
          className="rounded-full bg-white px-10 py-3 font-semibold border border-gray-300 text-gray-700"
          onClick={() => {
            window.location.href = `/?PROLIFIC_PID=${prolificId}`;
          }}
        >
          Take the survey again
        </button>
      </div>
    </main>
  );
}