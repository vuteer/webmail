import { useCustomEffect } from "@/hooks";
import { getNumbers } from "@/lib/api-calls/mails";
import { useMailNumbersStore } from "@/stores/mail-numbers";
import { useMailStoreState } from "@/stores/mail-store";

const FetchNumbers = () => {
  const { setInitialNumbers, unread } = useMailNumbersStore();
  // const { setInitialNumbers } = useMailStoreState();

  // const fetchNumbers = async () => {
  //   let res = await getNumbers();
  //   console.log(res, "numbers");
  //   if (res)
  //     setInitialNumbers(
  //       res.inbox?.unread || 0,
  //       res.inbox?.total || 0,
  //       res.drafts?.total || 0,
  //       res.outbox?.total || 0,
  //       res.sent?.total || 0,
  //       res.archived?.total || 0,
  //       res.spam?.total || 0,
  //       res.trash?.total || 0,
  //     );
  // };

  useCustomEffect(setInitialNumbers, [unread]);
  return <></>;
};

export default FetchNumbers;
