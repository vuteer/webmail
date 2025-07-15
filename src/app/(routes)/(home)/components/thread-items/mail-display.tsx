import { useCallback } from "react";
import { AppAvatar } from "@/components";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heading2 } from "@/components/ui/typography";
import { Mail } from "./mail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMailStoreState } from "@/stores/mail-store";
import { useSession } from "@/lib/auth-client";

interface MailDisplayProps {
  subject: string;
}

export const MailDisplay = ({ subject }: MailDisplayProps) => {
  const { data: session } = useSession();
  const user = session?.user;

  const renderPerson = useCallback(
    (person: any) => (
      <Popover key={person.email || person.address}>
        <PopoverTrigger asChild>
          <div
            // key={person.email | s}
            className="dark:bg-panelDark inline-flex items-center justify-start gap-1.5 overflow-hidden rounded-full border bg-white p-1 pr-2"
          >
            <AppAvatar
              src={person.picture || person.image || ""}
              name={person.name || person.address || person.email}
              dimension="w-5 h-5"
            />

            <div className="text-panelDark justify-start text-xs font-medium leading-none dark:text-white">
              {person.name || person.address || person.email}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="text-sm">
          <p>Email: {person.email || person.address}</p>
          <p>Name: {person.name || "Unknown"}</p>
        </PopoverContent>
      </Popover>
    ),
    [],
  );
  const { mails } = useMailStoreState();

  const people: any = mails[0]
    ? mails[0]?.from.address === user?.email
      ? Array.isArray(mails[0]?.to)
        ? [...mails[0]?.to]
        : [mails[0]?.to]
      : [mails[0]?.from]
    : [];

  return (
    <>
      <div className="relative overflow-hidden space-y-2">
        <Heading2 className="text-md lg:text-xl">{subject}</Heading2>
        <div className="text-muted-foreground flex items-center gap-2 text-sm dark:text-[#8C8C8C]">
          {(() => {
            if (people.length <= 2) {
              return people.map(renderPerson);
            }

            // Only show first two people plus count if we have at least two people
            const firstPerson = people[0];
            const secondPerson = people[1];

            if (firstPerson && secondPerson) {
              return (
                <>
                  {renderPerson(firstPerson)}
                  {renderPerson(secondPerson)}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm">
                        +{people.length - 2}{" "}
                        {people.length - 2 === 1 ? "other" : "others"}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="flex flex-col gap-1">
                      {people.slice(2).map((person: any, index: number) => (
                        <div key={index}>{renderPerson(person)}</div>
                      ))}
                    </TooltipContent>
                  </Tooltip>
                </>
              );
            }

            return null;
          })()}
        </div>
      </div>
      <Separator />
      {/* threads */}
      {/* <div className={"flex min-h-0  flex-col overflow-auto"}> */}
      <ScrollArea
        className="h-[calc(100vh)] w-full  "
        // type="auto"
      >
        {mails.map((mail, index) => (
          <Mail
            emailData={mail}
            key={index}
            index={index}
            totalEmails={mails.length}
          />
        ))}
        <div className="h-[300px]" />
      </ScrollArea>
      {/* </div> */}
    </>
  );
};
