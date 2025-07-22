import { useCustomEffect } from "@/hooks";
import { getNumbers } from "@/lib/api-calls/mails";
import { useMailNumbersStore } from "@/stores/mail-numbers";
import { useMailStoreState } from "@/stores/mail-store";

const FetchNumbers = () => {
  const { setInitialNumbers, unread } = useMailNumbersStore();

  useCustomEffect(setInitialNumbers, [unread]);
  return <></>;
};

export default FetchNumbers;
