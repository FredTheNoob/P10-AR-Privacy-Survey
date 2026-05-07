import { Suspense } from "react";
import Home from "./client-page";
import Spinner from "./_components/spinner";

export default function NoConsentPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Home />
    </Suspense>
  );
}