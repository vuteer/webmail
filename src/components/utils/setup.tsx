"use client";
import React from "react";
import { Heading4 } from "@/components/ui/typography";
import { Input } from "../ui/input";

import { useCustomEffect } from "@/hooks";
import { userPreferencesStore } from "@/stores/user-preferences";
import useMounted from "@/hooks/useMounted";
import { cn } from "@/lib/utils";

const FinalizeSetup = ({}) => {
  const { addInitialSeettings } = userPreferencesStore();

  const mounted = useMounted();

  const fetchPreferences = () => {
    if (!mounted) return;

    addInitialSeettings();
  };

  useCustomEffect(fetchPreferences, [mounted]);

  return <></>;
};

export default FinalizeSetup;

export const InputPair = ({
  label,
  value,
  placeholder,
  setValue,
  error,
  type,
  onKeyUp,
  prefixes,
  disabled,
}: {
  label?: string;
  placeholder: string;
  value: string;
  setValue: React.Dispatch<string>;
  error?: boolean;
  type?: string;
  onKeyUp?: (str: string, keyValue?: string) => Promise<void>;
  prefixes?: React.ReactNode;
  disabled: boolean;
}) => {
  const [active, setActive] = React.useState<boolean>(false);
  return (
    <div
      className={cn(
        "flex w-[100%] items-center border-b-[.08rem]",
        active ? "border-b-main-color" : error ? "border-b-danger" : "",
      )}
    >
      {label && <Heading4 className="text-sm lg:text-md">{label}</Heading4>}
      {prefixes && prefixes}
      <Input
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
        className={`${!label ? "pl-0" : ""} border-none focus:border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0`}
        onFocus={() => {
          setActive(true);
        }}
        onBlur={() => {
          setActive(false);
        }}
        onKeyUp={
          onKeyUp ? (e: any) => onKeyUp(e.target.value, e.key) : () => {}
        }
        type={type || "string"}
      />
    </div>
  );
};
