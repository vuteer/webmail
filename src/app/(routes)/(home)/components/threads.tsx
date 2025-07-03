// threads
import React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Search, RefreshCcw } from "lucide-react";

import AppInput from "@/components/common/app-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading1, Paragraph } from "@/components/ui/typography";
import Thread, { ThreadPlaceholder } from "./thread";
import SortPopover from "@/components/popovers/sort-mail";
import Confirm from "@/components/modals/confirm";

import { useCustomEffect } from "@/hooks/useEffect";
import { useSearch } from "@/hooks/useSearchParams";

import { createArray, numberWithCommas } from "@/utils/format-numbers";
import { createToast } from "@/utils/toast";
import { ThreadType } from "@/types";
import {
  deleteSelected,
  getThreads,
  markAsRead,
  searchThroughMail,
} from "@/lib/api-calls/mails";
import { cn } from "@/lib/utils";
import { useMailNumbersStore } from "@/stores/mail-numbers";
import FetchNumbers from "./fetch-numbers";
import { useMailStoreState } from "@/stores/mail-store";
import { useNotificationStateStore } from "@/stores/notification-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";

const Threads = ({ title }: { title: string }) => {
  // global state items
  const { inbox, unread } = useMailNumbersStore();
  const { deletedMails, newMails } = useMailStoreState();
  const { notifications, removeNotificationFromState } =
    useNotificationStateStore();

  const [mounted, setMounted] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [threads, setThreads] = React.useState<ThreadType[]>([]);
  const [count, setCount] = React.useState<number>(inbox);

  const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = React.useState<boolean>(false);

  const [selected, setSelected] = React.useState<string[]>([]);
  const [newMail, setNewMail] = React.useState<boolean>(false);

  const [page, setPage] = React.useState<number>(0);
  const [moreLoading, setMoreLoading] = React.useState<boolean>(false);

  const searchParams = useSearch();
  // const page = searchParams?.get("page") || "0";
  const sec = searchParams?.get("sec") || "";
  const q = searchParams?.get("q") || "";
  const sort = searchParams?.get("sort") || "";

  React.useEffect(() => setMounted(true), []);

  const fetchThreads = async (dont_reload?: boolean) => {
    if (!mounted) return;
    if (dont_reload) setLoading(true);

    let res =
      q || sort === "unread"
        ? await searchThroughMail(q, sort, title, page)
        : await getThreads(title, page);

    if (res) {
      setThreads(res);
    }

    setNewMail(false);
    setLoading(false);
    let nots = notifications.filter((not) => not.type === "mail");
    if (nots.length > 0) {
      for (let i = 0; i < nots.length; i++) {
        let curr = nots[i];
        removeNotificationFromState(curr);
      }
    }
  };

  const fetchMoreThreads = async () => {
    if (!page) return;
    setMoreLoading(true);
    let res = await getThreads(title, page);
    if (res) setThreads([...threads, ...res.docs]);
    setMoreLoading(false);
  };

  useCustomEffect(() => setSelected([]), [mounted, sec]);
  useCustomEffect(fetchThreads, [mounted, title, q, sort]);
  useCustomEffect(fetchMoreThreads, [page]);

  // update threads on new mail
  React.useEffect(() => {
    if (newMails.length === 0 || newMail) return;
    setNewMail(true);
  }, [newMails.length]);

  // update threads on delete
  React.useEffect(() => {
    if (deletedMails.length === 0) return;

    let updates = [...threads];
    let newCount = count;
    for (let i = 0; i < deletedMails.length; i++) {
      let curr = deletedMails[i];
      updates = [...updates.filter((thr) => thr.id !== curr)];
      newCount = newCount - 1;
    }
    setThreads([]);
    setCount(newCount);
    setThreads([...updates]);
  }, [deletedMails.length]);

  React.useEffect(() => {
    if (!mounted) return;
    setCount(inbox);
  }, [mounted, inbox]);
  // delete selected
  const handleDeleteSelected = async () => {
    setButtonLoading(true);

    // selected
    let res = await deleteSelected(selected, sec);

    if (res) {
      createToast("success", "Mails deleted");
      await fetchThreads(selected.length > 15 ? true : false);
      setSelected([]);
      setOpenDeleteModal(false);
    }

    setButtonLoading(false);
  };

  console.log(threads);
  // avatar, title namee, paragraph --- time/date
  return (
    <TooltipProvider delayDuration={0}>
      <Confirm
        title="Delete mails?"
        description="The mails will be moved to the trashed folder for 30 days before they are permanently deleted! Do you wish to proceed?"
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <div className="flex justify-end w-full">
          <Button onClick={handleDeleteSelected} disabled={buttonLoading}>
            Proceed
          </Button>
        </div>
      </Confirm>
      <FetchNumbers />
      <div className="rounded-xl bg-background h-full flex flex-col max-w-[500px] w-full lg:min-w-[500px]  px-4 pt-5">
        <div className="flex justify-between items-end mb-4">
          <div className="flex flex-col gap-1">
            <Heading1 className="text-lg lg:text-2xl capitalize flex flex-col">
              {title}
            </Heading1>
            {sec === "inbox" || !sec ? (
              <div className="flex gap-2 items-center text-xs lg:text-sm font-normal mt-1">
                <span>{`Total - ${numberWithCommas(inbox)}`}</span>
                {inbox && (sec === "inbox" || !sec) ? (
                  <>
                    <div className="h-[13px] w-[1px] bg-gray-500" />
                    <span>{`Unread - ${numberWithCommas(unread)}`}</span>
                  </>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="flex items-center gap-1">
            {sec === "inbox" || !sec ? (
              <SortPopover />
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full  cursor-default w-[100px] hover:bg-background"
              />
            )}
            <Button
              variant="outline"
              disabled={loading || buttonLoading}
              onClick={() => fetchThreads(true)}
              size={"sm"}
              className="rounded-full border"
            >
              <RefreshCcw size={18} />
            </Button>
          </div>
        </div>

        {count ? (
          <>
            {/* <Buttons
              selected={selected}
              threads={threads}
              loading={buttonLoading}
              setThreads={setThreads}
              setSelected={setSelected}
              setOpenDeleteModal={setOpenDeleteModal}
              setLoading={setButtonLoading}
            /> */}

            <SearchInput loading={loading} />
          </>
        ) : (
          <></>
        )}

        <Separator className={cn(count ? "mt-4" : "")} />
        <div className="relative overflow-hidden">
          {(sec === "inbox" || !sec) && newMail && (
            <LoadNewMails fetchThreads={fetchThreads} newMail={newMail} />
          )}
          <ScrollArea
            className={cn(
              "overflow-scroll h-[90vh] w-full pb-[8.4rem]",
              newMail ? "pt-4" : "",
            )}
          >
            {loading && <Loading />}
            {!loading && count ? (
              <>
                {threads.map((thread, index) => (
                  <Thread thread={thread} key={index} index={index} />
                ))}
              </>
            ) : (
              <></>
            )}
            {!loading && !count && (
              <>
                <Paragraph className="my-4 text-center">
                  You have no mail.
                </Paragraph>
              </>
            )}
            {count > Number(page + 1) * 30 && (
              <>
                <div className="w-full flex items-center justify-center py-2">
                  <span
                    className="cursor-pointer hover:text-main-color font-bold text-xs lg:text-sm"
                    onClick={() => {
                      let curr = page;
                      setPage(curr + 1);
                    }}
                  >
                    Load{moreLoading ? "ing" : " more"}...
                  </span>
                </div>
                <Separator />
              </>
            )}
          </ScrollArea>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Threads;

const LoadNewMails = ({
  fetchThreads,
  newMail,
}: {
  fetchThreads: any;
  newMail: boolean;
}) => (
  <div
    className={cn(
      "w-full mx-auto my-2 absolute top-0 left-0 bg-background flex justify-center items-center py-1 border-b duration-700",
      newMail ? "translate-y-0" : "translate-y-[100%]",
    )}
  >
    <span
      className="cursor-pointer flex items-center gap-2 text-xs lg:text-sm hover:text-main-color font-bold"
      onClick={fetchThreads}
    >
      <RefreshCcw size={15} />
      Load new mail
    </span>
  </div>
);

const Loading = () => (
  <>
    {createArray(15).map((_, index) => (
      <ThreadPlaceholder key={index} />
    ))}
  </>
);

const SearchInput = ({ loading }: { loading: boolean }) => {
  const { push } = useRouter();
  const searchParams = useSearch();
  const [search, setSearch] = React.useState<string>("");
  const sec = searchParams?.get("sec") || "inbox";

  const handleSearch = () => {
    push(`/?sec=${sec}&q=${search}`);
  };

  return (
    <>
      {search.length > 2 && (
        <div className="flex justify-between items-center my-1">
          <Paragraph className="text-xs lg:text-sm">
            Showing results for {search}
          </Paragraph>
          <span
            className="text-xs lg:text-sm cursor-pointer duration-700 hover:text-destructive"
            onClick={() => {
              push(`/?sec=${sec}`);
              setSearch("");
            }}
          >
            Reset
          </span>
        </div>
      )}
      <AppInput
        value={search}
        setValue={setSearch}
        disabled={loading}
        placeholder="Search..."
        icon={search.length < 2 && <Search size={20} />}
        button={
          search.length > 2 && (
            <Button size="icon" disabled={loading} onClick={handleSearch}>
              <Search size={18} />
            </Button>
          )
        }
      />
    </>
  );
};

// const Buttons = ({
//   selected,
//   threads,
//   loading,
//   setThreads,
//   setLoading,
//   setSelected,
//   setOpenDeleteModal,
// }: {
//   selected: string[];
//   threads: ThreadType[];
//   loading: boolean;
//   setThreads: React.Dispatch<ThreadType[]>;
//   setSelected: React.Dispatch<string[]>;
//   setOpenDeleteModal: React.Dispatch<boolean>;
//   setLoading: React.Dispatch<boolean>;
// }) => {
//   const searchParams = useSearch();
//   const sec = searchParams?.get("sec");

//   const { lessFromNumber, inbox } = useMailNumbersStore();

//   const handleRead = async (type: "all" | "selected") => {
//     setLoading(true);

//     let res = await markAsRead(type === "all", selected);

//     // if (res) {
//     //   createToast("success", "Mails marked as read.");
//     //   let new_threads = [];
//     //   let count = 0;

//     //   if (type === "all") {
//     //     new_threads = threads.map((doc) => ({ ...doc, unread: 0 }));
//     //   } else {
//     //     for (let i = 0; i < threads.length; i++) {
//     //       let curr = threads[i];

//     //       if (selected.includes(curr.id)) {
//     //         new_threads.push({ ...curr, unread: 0 });

//     //         count = curr.unread + count;
//     //       } else new_threads.push(curr);
//     //     }
//     //   }

//     //   lessFromNumber("inbox", count);
//     //   setThreads(new_threads);
//     //   setSelected([]);
//     // }
//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col gap-2 py-1 my-1">
//       <Separator />
//       <div className="flex justify-between gap-1">
//         {(sec === "inbox" || !sec) && inbox ? (
//           <div className="flex">
//             {selected.length > 0 && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 disabled={loading}
//                 onClick={() => handleRead("selected")}
//               >
//                 Read
//               </Button>
//             )}
//             <Button
//               variant="ghost"
//               size="sm"
//               disabled={loading}
//               onClick={() => handleRead("all")}
//             >
//               Read All{" "}
//             </Button>
//           </div>
//         ) : (
//           <></>
//         )}
//         <div
//           className={cn(
//             sec === "inbox" || !sec ? "justify-end" : "justify-start",
//             "flex gap-2 flex-1",
//           )}
//         >
//           {selected.length !== threads.length && (
//             <Button
//               variant="secondary"
//               size="sm"
//               disabled={loading}
//               onClick={() => {
//                 setSelected(threads.map((doc) => doc.id));
//               }}
//             >
//               Select All
//             </Button>
//           )}
//           {selected.length > 0 ? (
//             <>
//               <Button
//                 disabled={loading}
//                 variant="secondary"
//                 size="sm"
//                 className=""
//                 onClick={() => setSelected([])}
//               >
//                 Unselect All{" "}
//               </Button>
//             </>
//           ) : (
//             <></>
//           )}
//         </div>
//         {selected.length > 0 ? (
//           <Button
//             variant="destructive"
//             size="sm"
//             disabled={loading}
//             onClick={() => setOpenDeleteModal(true)}
//           >
//             <Trash2 size={18} />
//           </Button>
//         ) : (
//           <></>
//         )}
//       </div>
//       <Separator />
//     </div>
//   );
// };
