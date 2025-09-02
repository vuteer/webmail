// threads
import React from "react";
import { RefreshCcw, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { motion, AnimatePresence } from "framer-motion";

import AppInput from "@/components/common/app-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading1, Heading4, Paragraph } from "@/components/ui/typography";
import Thread, { ThreadPlaceholder } from "./thread";
import SortPopover from "@/components/popovers/sort-mail";

import { useCustomEffect } from "@/hooks/useEffect";

import { createArray, numberWithCommas } from "@/utils/format-numbers";

import { cn } from "@/lib/utils";
import { useMailNumbersStore } from "@/stores/mail-numbers";
import FetchNumbers from "./fetch-numbers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useThreadStore } from "@/stores/threads";
import useMounted from "@/hooks/useMounted";
import { markAllAsRead, searchMail } from "@/lib/api-calls/mails";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import { formatDate } from "@/lib/utils";
import Menu from "../../components/menu";
import { AppImage } from "@/components";
import { images } from "@/assets";

const Threads = () => {
  const {
    unread,
    inbox,
    drafts,
    sent,
    archive,
    junk,
    trash,
    lessFromNumber,
    setInitialNumbers,
  } = useMailNumbersStore();
  const { threads, threadsCount, fetchThreads, threadsLoading, updateThread } =
    useThreadStore();
  const mounted = useMounted();
  const [page] = useQueryState("page");
  const [threadId] = useQueryState("threadId");
  const [sec] = useQueryState("sec");
  const [sort] = useQueryState("sort");

  const [count, setCount] = React.useState<number>(sec === "inbox" ? inbox : 0);

  useCustomEffect(() => {
    if (!mounted) return;

    fetchThreads(sec || "inbox", Number(page || 0), sort ? "unread=true" : "");
  }, [mounted, sec, page, sort]);

  useCustomEffect(setInitialNumbers, [sec, sort]);

  const sectionsMap: Record<string, number> = {
    inbox,
    drafts,
    sent,
    archive,
    junk,
    trash,
  };
  useCustomEffect(() => {
    if (!mounted) return;
    setCount(threadsCount);
  }, [mounted, threadsCount, sec]);

  return (
    <TooltipProvider delayDuration={0}>
      <FetchNumbers />
      <div
        className={cn(
          "rounded-xl bg-background h-full flex flex-col lg:max-w-[500px] w-full lg:min-w-[500px]  px-4 pt-5",
          threadId ? "hidden lg:flex" : "flex",
        )}
      >
        <div className="lg:hidden flex justify-end ">
          <Menu />
        </div>
        <div className="flex justify-between items-end mb-4">
          <div className="flex flex-col gap-1">
            <Heading1 className="text-lg lg:text-2xl capitalize flex flex-col">
              {sec}
            </Heading1>
            {sec === "inbox" ? (
              <div className="flex gap-2 items-center text-xs lg:text-xs font-normal mt-1">
                <span>{`Total - ${numberWithCommas(inbox)}`}</span>
                {inbox && sec === "inbox" && unread ? (
                  <>
                    <div className="h-[13px] w-[1px] bg-gray-500" />
                    <span>{`Unread - ${numberWithCommas(unread)}`}</span>
                  </>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div>
                <span className="text-foreground-muted text-xs">
                  Found {threadsLoading ? "..." : count} thread
                  {count == 1 ? "" : "s"}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {sec === "inbox" ? <SortPopover /> : null}
            <Button
              variant="secondary"
              disabled={threadsLoading}
              className="rounded-full gap-2"
              onClick={() => {
                setInitialNumbers();
                fetchThreads(
                  sec || "inbox",
                  Number(page || 0),
                  sort ? "unread=true" : "",
                  true,
                );
              }}
              size={"sm"}
            >
              <RefreshCcw size={16} />
              <span className="text-xs lg:text-sm">Refresh</span>
            </Button>
            {sec === "inbox" && unread ? (
              <Button
                // variant="secondary"
                className="lg:flex hidden rounded-full min-w-[90px]"
                size="sm"
                onClick={() => {
                  markAllAsRead();
                  lessFromNumber("unread", unread);
                  threads.forEach((thrd) => {
                    updateThread(thrd.messageId, {
                      flags: [...thrd.flags, "\\Seen"],
                    });
                  });
                }}
              >
                <span>Read All</span>
              </Button>
            ) : null}
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
          <div className="overflow-y-auto h-[90vh] w-full">
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
              <div className="h-[80vh] flex flex-col items-center justify-center">
                <div className="w-[250px] h-[250px]">
                  <AppImage
                    alt="No mail"
                    title="No mail"
                    src={images.no_mail}
                    width={400}
                    height={400}
                    cls="w-full h-full object-contain"
                  />
                </div>
                <Paragraph className=" text-center font-bold">
                  You have no mail.
                </Paragraph>
              </div>
            )}
            <PaginateThreads count={count} />
            <div className="h-[100px]" />
          </div>
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

export type SearchedType = {
  id: string;
  subject: string;
  snippet: string;
  from: string;
  to: string;
  labels: string[];
  date: Date;
};

const SearchInput = ({ loading }: { loading: boolean }) => {
  const [search, setSearch] = React.useState<string>("");
  const [list, setList] = React.useState<SearchedType[]>([]);
  const [loadingSearch, setLoadingSearch] = React.useState<boolean>(false);
  const [q, setQ] = useQueryState("q");
  const [sec] = useQueryState("sec");

  const mounted = useMounted();

  React.useEffect(() => {
    if (!mounted || !q) {
      setSearch("");
      setList([]);
      setLoadingSearch(false);
      return;
    }
    setSearch(q);
  }, [mounted, q]);

  React.useEffect(() => {
    if (!mounted || !search) return;
    handleSearch();
  }, [mounted, search]);

  const handleSearch = async () => {
    // push(`/?sec=${sec}&q=${search}`);
    if (search.length < 2) return;
    setLoadingSearch(true);
    setQ(search);
    // handle api call here
    const res = await searchMail(search, sec!);
    setList(res);
    setLoadingSearch(false);
  };

  const SearchResults = () => (
    <AnimatePresence>
      {search.length > 2 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={cn(
            "shadow-md bg-secondary px-2 py-4 z-[30] absolute top-[48px] left-0 w-full",
          )}
        >
          <div className="flex justify-between items-center">
            <Heading4 className="text-xs lg:text-sm">
              Search results ....
            </Heading4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQ(null);
                setSearch("");
              }}
            >
              <X size={18} />
            </Button>
          </div>
          <Separator className="my-2" />
          <div className="space-y-3">
            {loadingSearch ? (
              <ScrollArea className="h-[350px] space-y-3">
                <div className="h-full space-y-3 ">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SearchSkeleton key={index} />
                  ))}
                </div>
              </ScrollArea>
            ) : null}
            {!loadingSearch && list.length ? (
              <ScrollArea className="h-[350px]">
                <div className="h-full space-y-3">
                  {list.map((item, index) => (
                    <SearchItem key={index} search={item} />
                  ))}
                </div>
              </ScrollArea>
            ) : null}
            {!loadingSearch && !list.length ? (
              <div className="text-center text-muted-foreground">
                No results found.
              </div>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {search.length > 2 && (
        <>
          <Separator className="my-1" />
          <div className="flex justify-between items-center my-2">
            <Paragraph className="text-xs lg:text-xs italic text-foreground-muted">
              Showing results for {search.slice(0, 100)}
            </Paragraph>
            <Button
              variant={"secondary"}
              size={"sm"}
              className="min-w-[100px] text-[#F43F5E] border-[#FCCDD5] bg-[#FDE4E9] dark:border-[#6E2532] dark:bg-[#411D23] text-xs lg:text-sm cursor-pointer duration-700 hover:text-destructive"
              onClick={() => {
                setQ(null);
                setSearch("");
              }}
            >
              Clear
            </Button>
          </div>
        </>
      )}
      <div className="relative">
        <AppInput
          value={search}
          setValue={setSearch}
          disabled={loading}
          placeholder="Search..."
          onKeyUp={handleSearch}
        />
        <SearchResults />
      </div>
    </>
  );
};

const SearchSkeleton = () => (
  <Card className="space-y-3 py-3 px-2">
    <div className="flex justify-between items-center">
      <Skeleton className="w-[100px] h-[15px] rounded-full" />
      <Skeleton className="w-[50px] h-[15px] rounded-full" />
    </div>
    <Skeleton className="w-[60%] h-[15px] rounded-full" />
    <Skeleton className="w-[100%] h-[15px] rounded-full" />
    <Separator />
  </Card>
);

const SearchItem = ({ search }: { search: SearchedType }) => {
  const { data: session } = useSession();
  const user: any = session?.user;
  const { email } = user;
  const [, setThreadId] = useQueryState("threadId");
  const [, setQuery] = useQueryState("q");

  const title = search.from.includes(email) ? search.to[0] : search.from;

  return (
    <Card
      className="space-y-3 py-3 px-2 cursor-pointer hover:bg-background"
      onClick={() => {
        setThreadId(search.id);
        setQuery(null);
      }}
    >
      <div className="flex justify-between items-center">
        <Heading4 className="text-sm lg:text-sm max-w-[80%] line-clamp-1">
          {title}
        </Heading4>
        <Paragraph className="text-xs lg:text-xs">
          {formatDate(new Date(search.date).toISOString())}
        </Paragraph>
      </div>
      <Paragraph className="font-bold line-clamp-1 text-sm lg:text-sm">
        {search.subject}
      </Paragraph>
      <Paragraph className="text-foreground-muted text-xs lg:text-xs line-clamp-1">
        {search.snippet.slice(0, 90) || ""}
      </Paragraph>
    </Card>
  );
};

// paginate threads
const PaginateThreads = ({ count }: { count: number }) => {
  const [page, setPage] = useQueryState("page");
  const { threadsLoading, moreLoading, setMoreLoading } = useThreadStore();

  const offset = (Number(page || 0) + 1) * 20;

  const handleLoadMore = async () => {
    setMoreLoading();
    const nextPage = Number(page) + 1;
    setPage(nextPage.toString());
  };

  if ((count < offset || threadsLoading) && !moreLoading) return null;
  return (
    <div className="w-full my-3">
      <Separator />
      <Button
        onClick={handleLoadMore}
        className="w-full rounded-full"
        disabled={moreLoading}
      >
        Load{moreLoading ? "ing..." : " more"}
      </Button>
    </div>
  );
};
