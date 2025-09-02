import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ArrowsPointingIn, PanelLeftOpen, Phone } from "../icons/icons";
// import { useActiveConnection } from "@/hooks/use-connections";
import { ResizablePanel } from "@/components/ui/resizable";
// import { useSearchValue } from "@/hooks/use-search-value";
import { useState, useEffect, useCallback } from "react";
// import useSearchLabels from "@/hooks/use-labels-search";
// import { useQueryClient } from "@tanstack/react-query";
// import { AIChat } from "@/components/create/ai-chat";
// import { useTRPC } from "@/providers/query-provider";
// import { Tools } from "../../../server/src/types";
// import { useDoState } from "../mail/use-do-state";
// import { useBilling } from "@/hooks/use-billing";
// import { PromptsDialog } from "./prompts-dialog";
import { Button } from "@/components/ui/button";
// import { useHotkeys } from "react-hotkeys-hook";
// import { useLabels } from "@/hooks/use-labels";
// import { useAgentChat } from "agents/ai-react";
import { X, Expand, Plus } from "lucide-react";
// import { IncomingMessageType } from "../party";
// import { Gauge } from "@/components/ui/gauge";
// import { useParams } from "react-router";
// import { useAgent } from "agents/react";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import { AIChat } from "./chat";
// import posthog from "posthog-js";
// import { toast } from "sonner";

interface ChatHeaderProps {
  onClose: () => void;
  onToggleFullScreen: () => void;
  onToggleViewMode: () => void;
  isFullScreen: boolean;
  isPopup: boolean;
  isPro: boolean;
  onNewChat: () => void;
}

function ChatHeader({
  onClose,
  onToggleFullScreen,
  onToggleViewMode,
  isFullScreen,
  isPopup,
  isPro,
  onNewChat,
}: ChatHeaderProps) {
  const [, setPricingDialog] = useQueryState("pricingDialog");
  // const { chatMessages } =
  // useBilling();
  const chatMessages = [];
  return (
    <div className="relative flex items-center justify-between px-2.5 pb-[10px] pt-[13px]">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onClose}
              variant="ghost"
              className="md:h-fit md:px-2"
            >
              <X className="dark:text-iconDark text-iconLight" />
              <span className="sr-only">Close chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Close chat</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex items-center gap-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleViewMode}
                variant="outline"
                size="icon"
                className="hidden md:flex "
              >
                {isPopup ? (
                  <PanelLeftOpen className="dark:fill-iconDark fill-iconLight" />
                ) : (
                  <Phone className="dark:fill-iconDark fill-iconLight" />
                )}
                <span className="sr-only"></span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Go to {isPopup ? "sidebar" : "popup"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/*<PromptsDialog />*/}

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onNewChat}
                size="icon"
                // variant="ghost"
                className=""
              >
                <Plus />
                <span className="sr-only">New chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>New chat</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

interface AISidebarProps {
  className?: string;
}

type ViewMode = "sidebar" | "popup" | "fullscreen";

export function useAIFullScreen() {
  const [isFullScreenQuery, setIsFullScreenQuery] =
    useQueryState("isFullScreen");

  // Initialize isFullScreen state from query parameter or localStorage
  const [isFullScreen, setIsFullScreenState] = useState<boolean>(() => {
    // First check query parameter
    if (isFullScreenQuery) {
      return isFullScreenQuery === "true";
    }

    // Then check localStorage if on client
    if (typeof window !== "undefined") {
      const savedFullScreen = localStorage.getItem("ai-fullscreen");
      if (savedFullScreen) {
        return savedFullScreen === "true";
      }
    }

    return false;
  });

  // Update both query parameter and localStorage when fullscreen state changes
  const setIsFullScreen = useCallback(
    (value: boolean) => {
      // Immediately update local state for faster UI response
      setIsFullScreenState(value);

      // For exiting fullscreen, we need to be extra careful to ensure state is updated properly
      if (!value) {
        // Force immediate removal from localStorage for faster response
        if (typeof window !== "undefined") {
          localStorage.removeItem("ai-fullscreen");
        }

        // Use setTimeout to ensure the state update happens in the next tick
        // This helps prevent the need for double-clicking
        setTimeout(() => {
          setIsFullScreenQuery(null).catch(console.error);
        }, 0);
      } else {
        // For entering fullscreen, we can use the normal flow
        setIsFullScreenQuery("true").catch(console.error);

        // Save to localStorage for persistence across sessions
        if (typeof window !== "undefined") {
          localStorage.setItem("ai-fullscreen", "true");
        }
      }
    },
    [setIsFullScreenQuery],
  );

  // Sync with query parameter on mount or when it changes
  useEffect(() => {
    const queryValue = isFullScreenQuery === "true";
    if (isFullScreenQuery !== null && queryValue !== isFullScreen) {
      setIsFullScreenState(queryValue);
    }
  }, [isFullScreenQuery, isFullScreen]);

  // Initialize from localStorage on mount if query parameter is not set
  useEffect(() => {
    if (typeof window !== "undefined" && !isFullScreenQuery) {
      const savedFullScreen = localStorage.getItem("ai-fullscreen");
      if (savedFullScreen === "true") {
        // setIsFullScreenQuery("true");
      }
    }

    // Force a re-render when exiting fullscreen mode
    if (isFullScreenQuery === null && isFullScreen) {
      setIsFullScreenState(false);
    }
  }, [isFullScreenQuery, setIsFullScreenQuery, isFullScreen]);

  return {
    isFullScreen,
    setIsFullScreen,
  };
}

export function useAISidebar() {
  const [open, setOpenQuery] = useQueryState("aiSidebar");
  const [viewModeQuery, setViewModeQuery] = useQueryState("viewMode");
  const { isFullScreen, setIsFullScreen } = useAIFullScreen();

  // Initialize viewMode from query parameter, localStorage, or default to 'sidebar'
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (viewModeQuery) return viewModeQuery as ViewMode;

    // Check localStorage for saved state if on client
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem("ai-viewmode");
      if (
        savedViewMode &&
        (savedViewMode === "sidebar" || savedViewMode === "popup")
      ) {
        return savedViewMode as ViewMode;
      }
    }

    return "popup";
  });

  // Update query parameter and localStorage when viewMode changes
  const setViewMode = useCallback(
    (mode: ViewMode) => {
      setViewModeState(mode);
      setViewModeQuery(mode === "popup" ? null : mode);

      // Save to localStorage for persistence across sessions
      if (typeof window !== "undefined") {
        localStorage.setItem("ai-viewmode", mode);
      }
    },
    [setViewModeQuery],
  );

  const setOpen = useCallback(
    (openState: boolean) => {
      if (!openState) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("ai-sidebar-open");
        }
        setTimeout(() => {
          setOpenQuery(null).catch(console.error);
        }, 0);
      } else {
        setOpenQuery("true").catch(console.error);
        if (typeof window !== "undefined") {
          localStorage.setItem("ai-sidebar-open", "true");
        }
      }
    },
    [setOpenQuery],
  );

  const toggleOpen = useCallback(
    () => setOpen(open !== "true"),
    [open, setOpen],
  );

  useEffect(() => {
    if (viewModeQuery && viewModeQuery !== viewMode) {
      setViewModeState(viewModeQuery as ViewMode);
    }
  }, [viewModeQuery, viewMode]);

  return {
    open: !!open,
    viewMode,
    setViewMode,
    setOpen,
    toggleOpen,
    toggleViewMode: () =>
      setViewMode(viewMode === "popup" ? "sidebar" : "popup"),
    isFullScreen,
    setIsFullScreen,
    // Add convenience boolean flags for each state
    isSidebar: viewMode === "sidebar",
    isPopup: viewMode === "popup",
  };
}

function AISidebar({ className }: AISidebarProps) {
  const {
    open,
    setOpen,
    isFullScreen,
    setIsFullScreen,
    toggleViewMode,
    isSidebar,
    isPopup,
  } = useAISidebar();
  // const { isPro, track, refetch: refetchBilling } = useBilling();
  // const queryClient = useQueryClient();
  // const trpc = useTRPC();
  const [threadId] = useQueryState("threadId");
  // const { folder } = useParams<{ folder: string }>();
  // const { refetch: refetchLabels } = useLabels();
  // const [searchValue] = useSearchValue();
  // const { data: activeConnection } = useActiveConnection();
  // const [, setDoState] = useDoState();
  // const { labels } = useSearchLabels();

  const onMessage = useCallback(
    (message: any) => {
      try {
        const parsedData = JSON.parse(message.data);
        const { type } = parsedData;
        // if (type === IncomingMessageType.Mail_Get) {
        //   const { threadId } = parsedData;
        //   queryClient.invalidateQueries({
        //     queryKey: trpc.mail.get.queryKey({ id: threadId }),
        //   });
        // } else if (type === IncomingMessageType.Mail_List) {
        //   const { folder } = parsedData;
        //   queryClient.invalidateQueries({
        //     queryKey: trpc.mail.listThreads.infiniteQueryKey({
        //       folder,
        //       labelIds: labels,
        //       q: searchValue.value,
        //     }),
        //   });
        // } else if (type === IncomingMessageType.User_Topics) {
        //   queryClient.invalidateQueries({
        //     queryKey: trpc.labels.list.queryKey(),
        //   });
        // } else if (type === IncomingMessageType.Do_State) {
        //   const { isSyncing, syncingFolders, storageSize, counts, shards } =
        //     parsedData;
        //   setDoState({
        //     isSyncing,
        //     syncingFolders,
        //     storageSize,
        //     counts: counts ?? [],
        //     shards,
        //   });
        // }
      } catch (error) {
        console.error("error parsing party message", error, {
          rawMessage: message.data,
        });
      }
    },
    [],
    // [queryClient, trpc, labels, searchValue.value, setDoState],
  );

  // const agent = useAgent({
  //   agent: "ZeroAgent",
  //   name: activeConnection?.id ? String(activeConnection.id) : "general",
  //   host: `${import.meta.env.VITE_PUBLIC_BACKEND_URL}`,
  //   onError: (e) => console.log(e),
  //   onMessage,
  // });

  // const chatState = useAgentChat({
  //   getInitialMessages: async () => {
  //     return [];
  //   },
  //   agent,
  //   maxSteps: 10,
  //   body: {
  //     threadId: threadId ?? undefined,
  //     currentFolder: folder ?? undefined,
  //     currentFilter: searchValue.value ?? undefined,
  //   },
  //   onError(error) {
  //     console.error("Error in useChat", error);
  //     posthog.capture("AI Chat Error", {
  //       error: error.message,
  //       threadId: threadId ?? undefined,
  //       currentFolder: folder ?? undefined,
  //       currentFilter: searchValue.value ?? undefined,
  //       messages: chatState.messages,
  //     });
  //     toast.error("Error, please try again later");
  //   },
  //   onResponse: (response) => {
  //     posthog.capture("AI Chat Response", {
  //       response,
  //       threadId: threadId ?? undefined,
  //       currentFolder: folder ?? undefined,
  //       currentFilter: searchValue.value ?? undefined,
  //       messages: chatState.messages,
  //     });
  //     if (!response.ok) {
  //       throw new Error("Failed to send message");
  //     }
  //   },
  //   async onToolCall({ toolCall }) {
  //     console.warn("toolCall", toolCall);
  //     posthog.capture("AI Chat Tool Call", {
  //       toolCall,
  //       threadId: threadId ?? undefined,
  //       currentFolder: folder ?? undefined,
  //       currentFilter: searchValue.value ?? undefined,
  //       messages: chatState.messages,
  //     });
  //     switch (toolCall.toolName) {
  //       case Tools.CreateLabel:
  //       case Tools.DeleteLabel:
  //         await refetchLabels();
  //         break;
  //       case Tools.SendEmail:
  //         await queryClient.invalidateQueries({
  //           queryKey: trpc.mail.listThreads.queryKey({ folder: "sent" }),
  //         });
  //         break;
  //       case Tools.MarkThreadsRead:
  //       case Tools.MarkThreadsUnread:
  //       case Tools.ModifyLabels:
  //       case Tools.BulkDelete:
  //         console.log("modifyLabels", toolCall.args);
  //         await refetchLabels();
  //         await Promise.all(
  //           (toolCall.args as { threadIds: string[] }).threadIds.map((id) =>
  //             queryClient.invalidateQueries({
  //               queryKey: trpc.mail.get.queryKey({ id }),
  //             }),
  //           ),
  //         );
  //         break;
  //     }
  //     await track({ featureId: "chat-messages", value: 1 });
  //     await refetchBilling();
  //   },
  // });

  // useHotkeys("Meta+0", () => {
  //   setOpen(!open);
  // });

  const handleNewChat = useCallback(() => {
    // chatState.setMessages([]);
    // chatState.setMessages([]);
    // }, [chatState]);
  }, []);

  return (
    <>
      {open && (
        <>
          {/* Desktop view - visible on md and larger screens */}
          {isSidebar && !isFullScreen && (
            <>
              <div className="w-px opacity-0" />
              <ResizablePanel
                defaultSize={24}
                minSize={8}
                maxSize={24}
                className="max-w-[350px] bg-secondary  hidden h-[calc(100dvh)] shadow-sm md:block md:rounded-lg md:shadow-sm"
              >
                <div
                  className={cn(
                    "h-[calc(98vh)] max-w-xl",
                    "flex flex-col",
                    "",
                    className,
                  )}
                >
                  <div className="flex h-full flex-col max-w-xl">
                    <ChatHeader
                      onClose={() => {
                        setOpen(false);
                        setIsFullScreen(false);
                      }}
                      onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
                      onToggleViewMode={toggleViewMode}
                      isFullScreen={isFullScreen}
                      isPopup={isPopup}
                      isPro={true}
                      // isPro={isPro ?? false}
                      onNewChat={handleNewChat}
                    />
                    <div className="relative flex-1 overflow-hidden px-2">
                      <AIChat />
                    </div>
                  </div>
                </div>
              </ResizablePanel>
            </>
          )}

          {/* Popup view - visible on small screens or when popup mode is selected */}
          <div
            tabIndex={0}
            className={cn(
              "bg-secondary shadow-md fixed inset-0 z-[50000] flex items-center justify-center  p-4 backdrop-blur-sm transition-opacity duration-150 sm:inset-auto sm:bottom-4 sm:right-4 sm:flex-col sm:items-end sm:justify-end sm:p-0",
              "md:hidden",
              isPopup && !isFullScreen && "md:flex",
              isFullScreen &&
                "inset-0! flex! p-0! opacity-100! backdrop-blur-none!",
              "rounded-2xl focus:opacity-100",
            )}
          >
            <div
              className={cn(
                " w-full max-w-lg overflow-hidden rounded-2xl border border-[#E7E7E7] shadow-lg dark:border-[#252525]",
                "md:hidden",
                isPopup &&
                  !isFullScreen &&
                  "w-[400px] max-w-[40vw] sm:w-[400px] md:block",
                isFullScreen && "block! max-w-4xl rounded-none! border-none!",
              )}
            >
              <div
                className={cn(
                  "flex w-full flex-col",
                  isFullScreen
                    ? "h-screen"
                    : "h-[90vh] sm:h-[600px] sm:max-h-[85vh]",
                )}
              >
                <ChatHeader
                  onClose={() => {
                    setOpen(false);
                    setIsFullScreen(false);
                  }}
                  onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
                  onToggleViewMode={toggleViewMode}
                  isFullScreen={isFullScreen}
                  isPopup={isPopup}
                  isPro={true}
                  // isPro={isPro ?? false}
                  onNewChat={handleNewChat}
                />
                <div className="relative flex-1 overflow-hidden px-2">
                  <AIChat />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AISidebar;
