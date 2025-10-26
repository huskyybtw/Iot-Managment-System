import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  // Add other user fields as needed
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/me");
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) {
            setUser(data);
          } else {
            setUser(null);
            router.replace("/");
          }
        } else {
          setUser(null);
          router.replace("/");
        }
      } catch (err) {
        setError("Failed to fetch user");
        setUser(null);
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  const { user, isLoading, error } = context;
  return { user, isLoading, error };
};
