"use client";

import { useEffect } from "react";
import { api } from "~/trpc/react";

export function BootstrapUser() {
  const bootstrap = api.user.create.useMutation();

  useEffect(() => {
    const run = async () => {
      const existing = localStorage.getItem("user");
      if (existing) return;
      
      const user = await bootstrap.mutateAsync({});

      localStorage.setItem("user", user.id);
    };

    void run();
  }, []);

  return null;
}