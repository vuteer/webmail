import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { ThreadType } from "@/types";

interface DraftType extends ThreadType {}

export const useDraft = (id: string | null) => {
  const { data: session } = useSession();
  const [draft, setDraft] = useState<DraftType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDraft = async () => {
      if (!id || !session?.user.id) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/drafts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch draft");

        const data = await res.json();
        setDraft(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [id, session?.user.id]);

  return { draft, draftLoading: loading, error };
};
