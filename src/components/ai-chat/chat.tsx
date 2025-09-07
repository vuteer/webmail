import { images } from "@/assets";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";
import { Heading4 } from "../ui/typography";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const AIChat = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);

  const handleQueryClick = (query: string) => {
    // editor.commands.setContent(query);
    // setInput(query);
    // editor.commands.focus();
  };
  return (
    <div>
      {messages.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="relative mb-4 h-[44px] w-[44px]">
            <Image
              src={theme === "dark" ? images.bot : images.bot2}
              alt="Bot"
              title="Bot"
              width={40}
              height={40}
              className="w-full h-full object-fit"
            />
          </div>
          <Heading4>Coming Soon...</Heading4>
          <p className="mb-1 mt-2 hidden text-center text-sm font-medium text-black md:block dark:text-white">
            Ask anything about your emails
          </p>
          <p className="mb-3 text-center text-sm text-[#8C8C8C] dark:text-[#929292]">
            Ask to do or show anything using natural language
          </p>

          {/* Example Thread */}
          <ExampleQueries onQueryClick={handleQueryClick} />
        </div>
      ) : null}
    </div>
  );
};

const ExampleQueries = ({
  onQueryClick,
}: {
  onQueryClick: (query: string) => void;
}) => {
  const firstRowQueries = [
    "Do I have any meetings today?",
    "Summarize today's emails",
    "Any email that needs urgent action",
  ];

  const secondRowQueries = [
    "Find all emails with reciepts",
    "What are some pending projects",
  ];

  return (
    <div className="relative mt-6 px-2 flex w-full max-w-xl flex-col items-center gap-2">
      {/* First row */}
      <div className="no-scrollbar relative flex w-full justify-center overflow-x-auto">
        <ScrollArea className="w-96 whitespace-nowrap">
          <div className="flex gap-4 px-4 my-1">
            {firstRowQueries.map((query) => (
              <button
                key={query}
                onClick={() => onQueryClick(query)}
                className="hover:text-primary hover:bg-secondary border-transparent hover:border-gray-200 shrink-0 whitespace-nowrap rounded-full shadow-md bg-background p-1 px-2 text-sm"
              >
                {query}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>
      {/* Second row */}
      <div className="no-scrollbar relative flex w-full justify-center overflow-x-auto">
        <ScrollArea className="w-96 whitespace-nowrap">
          <div className="flex gap-4 px-4 my-1">
            {secondRowQueries.map((query) => (
              <button
                key={query}
                onClick={() => onQueryClick(query)}
                className="shadow-md rounded-full hover:text-primary hover:bg-secondary border-transparent hover:border-gray-200 shrink-0 whitespace-nowrap bg-background p-1 px-2 text-sm "
              >
                {query}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>
      {/* Left mask */}
      <div className="from-panelLight dark:from-panelDark bg-linear-to-r pointer-events-none absolute bottom-0 left-0 top-0 w-12 to-transparent"></div>
      {/* Right mask */}
      <div className="from-panelLight dark:from-panelDark bg-linear-to-l pointer-events-none absolute bottom-0 right-0 top-0 w-12 to-transparent"></div>
    </div>
  );
};
