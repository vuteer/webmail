"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type ComboboxType = {
  value: string;
  label: string;
};

export function Combobox({
  values,
  value,
  setValue,
  title,
}: {
  values: ComboboxType[];
  value: string;
  setValue: React.Dispatch<string>;
  title: string;
}) {
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? values.find((val) => val.value === value)?.label
            : `Select ${title}...`}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${title}...`} />
          <CommandList>
            <CommandEmpty>No {title} found.</CommandEmpty>
            <CommandGroup>
              {values.map((val) => (
                <CommandItem
                  key={val.value}
                  value={val.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === val.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {val.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
