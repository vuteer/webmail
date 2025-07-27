// sort popover
"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { CheckCheck, ChevronDown } from "lucide-react";
import { Paragraph } from "@/components/ui/typography";

import PopoverContainer from "./container";
import { AppLinkButton } from "@/components";
import { useQueryState } from "nuqs";

type SortTypes = "recent" | "unread";

const SortPopover = () => {
  const [current, setCurrent] = React.useState<SortTypes>("recent");
  const [sort, setSort] = useQueryState("sort");

  React.useEffect(() => {
    setCurrent(!sort ? "recent" : "unread");
  }, [sort]);

  const list = ["recent", "unread"] as const;

  return (
    <PopoverContainer
      contentClassName="w-[150px] absolute  -right-12"
      trigger={
        <AppLinkButton
          type="outline"
          size="sm"
          className="rounded-full border flex items-center justify-between gap-2 w-[100px]"
        >
          <span className="capitalize text-xs lg:text-sm">{current}</span>
          <ChevronDown size={18} />
        </AppLinkButton>
      }
    >
      <div className="flex flex-col gap-2">
        {list.map((item: SortTypes, index: number) => (
          <Paragraph
            key={index}
            className="duration-700 cursor-pointer hover:text-main-color flex items-center gap-2"
            onClick={() => {
              setSort(item === "unread" ? "unread" : null);
            }}
          >
            <CheckCheck
              size={18}
              color={
                (item === "recent" && !sort) ||
                (item === "unread" && sort === "unread")
                  ? "#1C63EA"
                  : "transparent"
              }
            />
            <span className={"text-xs lg:text-sm capitalize"}>{item}</span>
          </Paragraph>
        ))}
      </div>
    </PopoverContainer>
  );
};

export default SortPopover;
