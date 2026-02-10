// hooks/useUser.ts
"use client";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  provider: string;
}

export function useUser() {
  // undefined = loading, null = logged out, User = logged in
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/current-user", {
          credentials: "include",
        });

        if (res.status === 429) {
    alert("Whoa there! You're sending requests too fast.");
    throw new Error("Rate limited");
  }
  
        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        // Check if your API returns { user: {...} } or just {...}
        console.log("Fetched user data:", data);
        setUser(data.user || data);
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}