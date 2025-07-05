// threads
import React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Search, RefreshCcw } from "lucide-react";
import { useQueryState } from "nuqs";

import AppInput from "@/components/common/app-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading1, Paragraph } from "@/components/ui/typography";
import Thread, { ThreadPlaceholder } from "./thread";
import SortPopover from "@/components/popovers/sort-mail";

import { useCustomEffect } from "@/hooks/useEffect";
import { useSearch } from "@/hooks/useSearchParams";

import { createArray, numberWithCommas } from "@/utils/format-numbers";

import { cn } from "@/lib/utils";
import { useMailNumbersStore } from "@/stores/mail-numbers";
import FetchNumbers from "./fetch-numbers";
// import { useMailStoreState } from "@/stores/mail-store";
// import { useNotificationStateStore } from "@/stores/notification-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useThreadStore } from "@/stores/threads";
import useMounted from "@/hooks/useMounted";

const Threads = () => {
  // global state items
  const { inbox, unread } = useMailNumbersStore();
  const { threads, fetchThreads, threadsLoading } = useThreadStore();
  const mounted = useMounted();
  const [page, setPage] = useQueryState("page");
  const [q] = useQueryState("q");
  const [sec] = useQueryState("sec");
  const [sort] = useQueryState("sort");

  const [count, setCount] = React.useState<number>(inbox);

  const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = React.useState<boolean>(false);

  const [selected, setSelected] = React.useState<string[]>([]);
  const [newMail, setNewMail] = React.useState<boolean>(false);

  // const [page, setPage] = React.useState<number>(0);
  const [moreLoading, setMoreLoading] = React.useState<boolean>(false);

  useCustomEffect(() => {
    if (!mounted) return;

    fetchThreads(sec || "inbox", Number(page || 0));
  }, [mounted, sec, page]);

  React.useEffect(() => {
    if (!mounted) return;
    setCount(inbox);
  }, [mounted, inbox]);

  return (
    <TooltipProvider delayDuration={0}>
      <FetchNumbers />
      <div className="rounded-xl bg-background h-full flex flex-col max-w-[500px] w-full lg:min-w-[500px]  px-4 pt-5">
        <div className="flex justify-between items-end mb-4">
          <div className="flex flex-col gap-1">
            <Heading1 className="text-lg lg:text-2xl capitalize flex flex-col">
              {sec}
            </Heading1>
            {sec === "inbox" ? (
              <div className="flex gap-2 items-center text-xs lg:text-sm font-normal mt-1">
                <span>{`Total - ${numberWithCommas(inbox)}`}</span>
                {inbox && sec === "inbox" ? (
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
            {sec === "inbox" ? <SortPopover /> : null}
            <Button
              variant="outline"
              disabled={threadsLoading || buttonLoading}
              onClick={() => fetchThreads(sec || "inbox", Number(page || 0))}
              size={"sm"}
              className="rounded-full border"
            >
              <RefreshCcw size={18} />
            </Button>
          </div>
        </div>

        {count ? (
          <>
            <SearchInput loading={threadsLoading} />
          </>
        ) : (
          <></>
        )}

        <Separator className={cn(count ? "mt-4" : "")} />
        <div className="relative overflow-hidden">
          <ScrollArea
            className={cn(
              "overflow-scroll h-[90vh] w-full pb-[8.4rem]",
              newMail ? "pt-4" : "",
            )}
          >
            {threadsLoading && <Loading />}
            {!threadsLoading && count ? (
              <>
                {threads.map((thread, index) => (
                  <Thread thread={thread} key={index} index={index} />
                ))}
              </>
            ) : (
              <></>
            )}
            {!threadsLoading && !count && (
              <>
                <Paragraph className="my-4 text-center">
                  You have no mail.
                </Paragraph>
              </>
            )}
            {count > (Number(page || 0) + 1) * 30 && (
              <>
                <div className="w-full flex items-center justify-center py-2">
                  <span
                    className="cursor-pointer hover:text-main-color font-bold text-xs lg:text-sm"
                    onClick={() => {
                      let curr = Number(page || 0);
                      setPage(String(curr + 1));
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
