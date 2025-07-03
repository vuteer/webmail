import { AppAvatar } from "@/components";
import { AvatarImage } from "@/components/plate-ui/avatar";
import { Avatar } from "@/components/ui/avatar";
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
import { ThreadType } from "@/types";
import { useCallback } from "react";
import { MailHeaderDetails } from "./mai-header-dets";

interface MailDisplayProps {
  mails: ThreadType[];
  subject: string;
}

export const MailDisplay = ({ mails, subject }: MailDisplayProps) => {
  const renderPerson = useCallback(
    (person: any) => (
      <Popover key={person.email || person.address}>
        <PopoverTrigger asChild>
          <div
            key={person.email}
            className="dark:bg-panelDark inline-flex items-center justify-start gap-1.5 overflow-hidden rounded-full border bg-white p-1 pr-2"
          >
            <AppAvatar
              src={person.picture || person.image || ""}
              name={person.name || person.email}
              dimension="w-5 h-5"
            />

            <div className="text-panelDark justify-start text-xs font-medium leading-none dark:text-white">
              {person.name || person.email}
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

  const people = [mails[0].from];

  return (
    <>
      <div className="relative flex-1 overflow-hidden space-y-2">
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
                      {people.slice(2).map((person, index) => (
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
      {mails.map((mail, index) => (
        <MailHeaderDetails
          emailData={mail}
          key={index}
          index={index}
          totalEmails={mails.length}
        />
      ))}
    </>
  );
};
