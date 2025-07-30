import useMounted from "@/hooks/useMounted";
import { getQuotas } from "@/lib/api-calls/files";
import { fileStateStore } from "@/stores/files";
import React from "react";

export const GetQuotas = () => {
  const mounted = useMounted();
  const { adjustStorage } = fileStateStore();

  React.useEffect(() => {
    if (mounted) fetchQuotas();
  }, [mounted]);

  const fetchQuotas = async () => {
    const res = await getQuotas();

    if (res.quota) adjustStorage(res.quota.used, "used");
    if (res.quota) adjustStorage(res.quota.quota, "total");
  };

  return <></>;
};
