"use client"

import { env } from "~/env";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "../_components/spinner";
import { api } from "~/trpc/react";
import { skipToken } from "@tanstack/react-query";

export default function DoneClientPage() {
  const searchParams = useSearchParams();
  const prolificId = searchParams.get("PROLIFIC_PID");


  const { data: hasCompletedSurveyData } =
    api.user.hasCompletedSurvey.useQuery(
      prolificId ? { prolificId } : skipToken
    );

  const { data: hasBeenRedirectedToProlificData } =
    api.user.hasBeenRedirectedToProlific.useQuery(
      prolificId ? { prolificId } : skipToken
    );

  const setHasBeenRedirectedToProlificApi = api.user.setHasBeenRedirectedToProlific.useMutation();

  const [isLoading, setIsLoading] = useState(true);
  const [surveyComplete, setSurveyComplete] = useState(false);
  const [hasBeenRedirectedToProlific, setHasBeenRedirectedToProlific] = useState(false);

  useEffect(() => {
    if (hasCompletedSurveyData === undefined || hasBeenRedirectedToProlificData === undefined) return;
    setSurveyComplete(localStorage.getItem("surveyComplete") === "true" || hasCompletedSurveyData);
    setHasBeenRedirectedToProlific(localStorage.getItem("hasBeenRedirectedToProlific") === "true" || hasBeenRedirectedToProlificData);
    setIsLoading(false);
  }, [hasCompletedSurveyData, hasBeenRedirectedToProlificData]);

  if (!prolificId) {
    return <p className="flex min-h-screen flex-col items-center justify-center">
      Prolific ID not found in URL. Please access the survey through the Prolific link provided to you.
    </p>
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (!surveyComplete) {
    return <p className="flex min-h-screen flex-col items-center justify-center">
      It seems you haven&apos;t completed the survey yet. Please complete the survey before accessing this page.
    </p>
  }

  return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl text-center space-y-4">
          <h1 className="text-3xl font-semibold">Thank you for participating</h1>
          <p className="text-gray-700">
            Your responses have been submitted successfully.
          </p>
          {hasBeenRedirectedToProlific && (
            <p className="text-gray-700">
              You can now close this window.
            </p>
          )}
          {!hasBeenRedirectedToProlific && (
            <button
              type="submit"
              className="rounded-full bg-white px-10 py-3 font-semibold border border-gray-300 text-gray-700"
              onClick={async () => {
                localStorage.setItem("hasBeenRedirectedToProlific", "true");
                await setHasBeenRedirectedToProlificApi.mutateAsync({ prolificId });
                window.location.href = env.NEXT_PUBLIC_PROLIFIC_COMPLETION_URL;
              }}
            >
              Go back to Prolific
            </button>
          )}
        </div>
      </main>
  );
}