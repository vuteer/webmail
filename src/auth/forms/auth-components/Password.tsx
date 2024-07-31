import React from "react";

import { Eye, EyeOff, Lock } from "lucide-react";
import { FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resetClass } from "@/components/common/app-input";
import { Heading4 } from "@/components/ui/typography";

interface PasswordProps {
  loading: boolean;
  field: object;
}

const Password: React.FC<PasswordProps> = ({ loading, field }) => {
  return (
    <FormItem>
      <FormControl>
        <>
          <PasswordInput loading={loading} field={field} />
        </>
      </FormControl>
    </FormItem>
  );
};

export default Password;

// password input component
export const PasswordInput = ({
  loading,
  field,
  value,
  setValue,
  label,
}: {
  loading: boolean;
  field?: any;
  value?: string;
  setValue?: React.Dispatch<string>;
  label?: string;
}) => {
  const [type, setType] = React.useState<string>("password");
  const [focused, setFocused] = React.useState<boolean>(false);

  return (
    <>
      {label && (
        <Heading4 className="my-2 text-sm lg:text-md font-bold">
          {label}
        </Heading4>
      )}
      <div
        className={cn(
          field
            ? ``
            : !focused
            ? "border border-secondary pl-2"
            : "border-secondary-color border pl-2",
          "flex items-center relative rounded-lg"
        )}
      >
        <Lock className={"absolute top-2.5 left-2 h-5 w-5"} />
        {!field ? (
          <Input
            className={`${resetClass} border-none pl-8 pr-12`}
            disabled={loading}
            placeholder={"*******"}
            type={type}
            value={value}
            onFocus={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFocused(true)
            }
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFocused(false)
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue && setValue(e.target.value)
            }
          />
        ) : (
          <Input
            className="pl-8 pr-12"
            disabled={loading}
            placeholder={"*******"}
            type={type}
            {...(field && field)}
          />
        )}

        <Button
          variant="ghost"
          onClick={() => setType(type === "password" ? "text" : "password")}
          className="absolute right-0"
          type="button"
        >
          {type === "password" ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </Button>
      </div>
    </>
  );
};
