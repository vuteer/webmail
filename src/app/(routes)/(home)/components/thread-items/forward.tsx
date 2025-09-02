import React, { useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Command, X } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToItems } from "@/components/editor/compose/to";
import { CurvedArrow, Forward } from "@/components/icons/icons";
import { cn } from "@/lib/utils";
import { createToast } from "@/utils/toast";
import { jsxToHtml } from "@/components/editor/compose/jsx-to-html";
import { useSession } from "@/lib/auth-client";
import { sendingMail } from "@/components/editor/compose/send";

import { useThreadStore } from "@/stores/threads";
import { useQueryState } from "nuqs";

const schema = z.object({
  to: z.array(z.string().email()).min(1),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
});

export const ForwardToInputs = ({
  disabled,
  emailData,
}: {
  disabled: boolean;
  emailData: any;
}) => {
  const { data: session } = useSession();
  const { appendThread } = useThreadStore();

  const user = session?.user;

  const [sec] = useQueryState("sec");
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [, setHasUnsavedChanges] = React.useState<boolean>(false);
  const [showCc, setShowCc] = React.useState(false);
  const [showBcc, setShowBcc] = React.useState(false);

  const [isAddingRecipients, setIsAddingRecipients] = React.useState(false);
  const [isAddingCcRecipients, setIsAddingCcRecipients] = React.useState(false);
  const [isAddingBccRecipients, setIsAddingBccRecipients] =
    React.useState(false);

  const toWrapperRef = useRef<HTMLDivElement>(null);
  const ccWrapperRef = useRef<HTMLDivElement>(null);
  const bccWrapperRef = useRef<HTMLDivElement>(null);

  const toInputRef = useRef<HTMLInputElement>(null);
  const ccInputRef = useRef<HTMLInputElement>(null);
  const bccInputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDialogOpen(false);
    } else {
      setDialogOpen(true);
    }
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      to: [],
      cc: [],
      bcc: [],
    },
  });

  const { watch, setValue, getValues } = form;
  const toEmails = watch("to");
  const ccEmails = watch("cc");
  const bccEmails = watch("bcc");

  const handleFoward = async () => {
    if (!user) return;
    const to = getValues("to");
    const cc = getValues("cc");
    const bcc = getValues("bcc");

    if (!to.length) {
      createToast("Input Error", "The to email is required", "danger");
      return;
    }
    setLoading(true);
    const mail = {
      subject: "FWD: " + emailData.subject,
      to: to || [],
      cc: cc || [],
      bcc: bcc || [],
      message: jsxToHtml(emailData.html || emailData.text),
      attachments: emailData.attachments,
    };

    const sendingUser = {
      email: user.email,
      name: user.name,
      image: user.image,
    };

    const res = await sendingMail(
      mail,
      sendingUser,
      "forward",
      null,
      emailData,
    );

    if (res) {
      if (sec === "sent") {
        const thread: any = {
          uid: Math.floor(Math.random() * 3000),
          _id: res.thread,
          messageId: res.messageId,
          subject: mail.subject,
          from: { address: user.email, name: user.name },
          to: to.map((m: string) => ({ address: m, name: m })),
          flags: ["\\Seen"],
          date: new Date().toISOString(),
          hasAttachment: emailData?.attachments?.length ? true : false,
          trashed: false,
        };
        appendThread(thread);
      }

      setDialogOpen(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={!!dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogDescription></DialogDescription>

      <DialogTrigger asChild>
        <button
          disabled={disabled || loading}
          className="inline-flex h-7 items-center justify-center gap-1 overflow-hidden rounded-md border bg-white px-1.5 dark:border-none dark:bg-[#313131]"
        >
          <Forward />
          <div className="flex items-center justify-center gap-2.5 pl-0.5 pr-1">
            <div className="justify-start text-sm leading-none text-black dark:text-white">
              Forward
            </div>
          </div>

          <kbd
            className={cn(
              "border-muted-foreground/10 bg-accent h-6 rounded-[6px] border px-1.5 font-mono text-xs leading-6",
              "-me-1 ms-auto hidden max-h-full items-center md:inline-flex",
            )}
          >
            f
          </kbd>
        </button>
      </DialogTrigger>

      <DialogContent className="h-screen w-screen flex flex-col items-center justify-center max-w-none border-none bg-white/40 dark:bg-black/40 backdrop-blur-md p-0 shadow-none">
        <div className="max-w-[750px] mx-auto  w-full">
          <DialogClose asChild className="flex">
            <Button size={"sm"} className="flex items-center gap-1 rounded-lg ">
              <X size={18} />
              <span className="text-sm font-medium">Esc</span>
            </Button>
          </DialogClose>
        </div>
        <div className="py-4 px-2 flex flex-col bg-background min-h-[20vh] border rounded-2xl max-w-[750px] mx-auto w-full">
          <div className="flex-1">
            <ToItems
              isAddingRecipients={isAddingRecipients}
              toEmails={toEmails}
              showCc={showCc}
              showBcc={showBcc}
              ccEmails={ccEmails}
              bccEmails={bccEmails}
              isAddingCcRecipients={isAddingCcRecipients}
              isAddingBccRecipients={isAddingBccRecipients}
              setValue={setValue}
              setIsAddingBccRecipients={setIsAddingBccRecipients}
              setIsAddingCcRecipients={setIsAddingCcRecipients}
              setIsAddingRecipients={setIsAddingRecipients}
              setShowCc={setShowCc}
              setShowBcc={setShowBcc}
              setHasUnsavedChanges={setHasUnsavedChanges}
              toWrapperRef={toWrapperRef}
              toInputRef={toInputRef}
              ccInputRef={ccInputRef}
              ccWrapperRef={ccWrapperRef}
              bccInputRef={bccInputRef}
              bccWrapperRef={bccWrapperRef}
              onClose={() => setDialogOpen(false)}
            />
          </div>

          <div className="flex items-center justify-start gap-2">
            <button
              className="flex h-7 cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-md bg-black pl-1.5 pr-1 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white"
              onClick={handleFoward}
              disabled={loading}
            >
              <div className="flex items-center justify-center gap-2.5 pl-0.5">
                <div className="text-center text-sm leading-none text-white dark:text-black">
                  <span>Forward </span>
                </div>
              </div>
              <div className="flex h-5 items-center justify-center gap-1 rounded-sm bg-white/10 px-1 dark:bg-black/10">
                <Command className="h-3.5 w-3.5 text-white dark:text-black" />
                <CurvedArrow className="mt-1.5 h-4 w-4 fill-white dark:fill-black" />
              </div>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
