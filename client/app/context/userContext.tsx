"use client";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<unknown>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/current-user", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
