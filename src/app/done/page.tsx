import { Suspense } from "react";
import DoneClient from "./done-client";
import Spinner from "../_components/spinner";

export default function DonePage() {
  return (
    <Suspense fallback={<Spinner />}>
      <DoneClient />
    </Suspense>
  );
}