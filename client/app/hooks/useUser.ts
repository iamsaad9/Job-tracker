// hooks/useUser.ts
"use client";
import { useEffect, useState } from "react";
interface User{
  name:string,
  avatar:string,
  email:string,
}
export function useUser() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/current-user") // Adjust path to match your folder structure
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}