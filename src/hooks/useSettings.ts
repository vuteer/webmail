import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

interface Settings {
  theme: string;
  notifications: boolean;
  // Add more fields as needed
}

export function useSettings() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!session?.user.id) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to fetch settings");

        const data = await res.json();
        setSettings(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [session?.user.id]);

  return { settings, settingsLoading: loading, error };
}
