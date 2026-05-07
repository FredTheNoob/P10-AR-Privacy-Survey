import { Suspense } from "react";
import Spinner from "../_components/spinner";
import NoConsentClientPage from "./no-consent-client";

export default function NoConsentPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <NoConsentClientPage />
    </Suspense>
  );
}