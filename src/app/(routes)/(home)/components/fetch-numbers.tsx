import { useCustomEffect } from "@/hooks";
import { getNumbers } from "@/lib/api-calls/mails";
import { useMailNumbersStore } from "@/stores/mail-numbers";
import { useMailStoreState } from "@/stores/mail-store";

const FetchNumbers = () => {
  const { setInitialNumbers } = useMailNumbersStore();
  const { deletedMails } = useMailStoreState();

  const fetchNumbers = async () => {
    let res = await getNumbers();

    if (res)
      setInitialNumbers(
        res.inbox.total || 0,
        0,
        res.drafts.total || 0,
        res.inbox.unread || 0,
      );
  };

  useCustomEffect(fetchNumbers, [deletedMails.length]);
  return <></>;
};

export default FetchNumbers;
