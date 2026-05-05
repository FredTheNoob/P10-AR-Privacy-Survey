"use client";

import { useEffect } from "react";
import { api } from "~/trpc/react";

export function BootstrapUser() {
  const bootstrap = api.user.create.useMutation();

  useEffect(() => {
    bootstrap.mutate({});
  }, []);

  return null;
}