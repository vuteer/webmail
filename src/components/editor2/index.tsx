// import { useActiveConnection, useConnections } from "@/hooks/use-connections";
import { Dialog, DialogClose } from "@/components/ui/dialog";
// import { useEmailAliases } from "@/hooks/use-email-aliases";
import { cleanEmailAddresses } from "@/lib/email-utils";
import { useHotkeysContext } from "react-hotkeys-hook";
// import { useTRPC } from '@/providers/query-provider';
import { useEffect, useMemo, useState } from "react";
// import { useMutation } from '@tanstack/react-query';
// import { useSettings } from '@/hooks/use-settings';
import { EmailComposer } from "./email-compose";
import { useSession } from "@/lib/auth-client";
import { serializeFiles } from "@/lib/schemas";
// import { useDraft } from "@/hooks/use-drafts";
// import { useNavigate } from 'react-router';
import { useTranslations } from "use-intl";
// import { useQueryState } from 'nuqs';
import { X } from "lucide-react";
import posthog from "posthog-js";
import { toast } from "sonner";
import "./prosemirror.css";
import { useSearch } from "@/hooks";
import { Button } from "../ui/button";
import { sendMail } from "@/lib/api-calls/mails";

// Define the draft type to include CC and BCC fields
type DraftType = {
  id: string;
  content?: string;
  subject?: string;
  to?: string[];
  cc?: string[];
  bcc?: string[];
};

// Define the connection type
type Connection = {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  createdAt: Date;
};

export function CreateEmail({
  initialTo = "",
  initialSubject = "",
  initialBody = "",
  initialCc = "",
  initialBcc = "",
  draftId: propDraftId,
}: {
  initialTo?: string;
  initialSubject?: string;
  initialBody?: string;
  initialCc?: string;
  initialBcc?: string;
  draftId?: string | null;
}) {
  const { data: session } = useSession();

  const draftId = useSearch()?.get("draftId");

  const [isDraftFailed, setIsDraftFailed] = useState(false);

  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || "";

  const handleSendEmail = async (data: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    message: string;
    attachments: File[];
    fromEmail?: string;
  }) => {
    const fromEmail = userEmail;

    // add signature here
    // const zeroSignature = settings?.settings.zeroSignature
    //   ? '<p style="color: #666; font-size: 12px;">Sent via <a href="https://0.email/" style="color: #0066cc; text-decoration: none;">Zero</a></p>'
    //   : "";

    let mail = {
      to: data.to.map((email) => ({
        email,
        name: email.split("@")[0] || email,
      })),
      cc: data.cc?.map((email) => ({
        email,
        name: email.split("@")[0] || email,
      })),
      bcc: data.bcc?.map((email) => ({
        email,
        name: email.split("@")[0] || email,
      })),
      subject: data.subject,
      message: data.message,
      attachments: await serializeFiles(data.attachments),
      fromEmail,
      draftId: draftId ?? undefined,
    };

    console.log(mail);
    await sendMail(mail);
    // Clear draft ID from URL
    // await setDraftId(null);

    // toast.success(t("pages.createEmail.emailSentSuccessfully"));
  };

  // useEffect(() => {
  //   if (propDraftId && !draftId) {
  //     setDraftId(propDraftId);
  //   }
  // }, [propDraftId, draftId, setDraftId]);

  // Process initial email addresses
  const processInitialEmails = (emailStr: string) => {
    if (!emailStr) return [];
    const cleanedAddresses = cleanEmailAddresses(emailStr);
    return cleanedAddresses || [];
  };

  // Cast draft to our extended type that includes CC and BCC
  // const typedDraft = draft as unknown as DraftType;

  // const handleDialogClose = (open: boolean) => {
  //   setIsComposeOpen(open ? "true" : null);
  //   if (!open) {
  //     setDraftId(null);
  //   }
  // };

  // <Dialog open={!!isComposeOpen} onOpenChange={handleDialogClose}>
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-1">
        <div className="flex w-[750px] justify-start">
          <DialogClose asChild className="flex">
            <Button size={"sm"} className="flex items-center gap-1 rounded-lg ">
              <X size={18} />
              <span className="text-sm font-medium">Esc</span>
            </Button>
          </DialogClose>
        </div>
        {false ? (
          <div className="flex h-[600px] w-[750px] items-center justify-center rounded-2xl border">
            <div className="text-center">
              <div className="mx-auto mb-4 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              <p>Loading draft...</p>
            </div>
          </div>
        ) : (
          <EmailComposer
            key={"composer"}
            className="mb-12 rounded-2xl border"
            onSendEmail={handleSendEmail}
            initialMessage={initialBody}
            initialTo={
              // typedDraft?.to?.map((e: string) => e.replace(/[<>]/g, "")) ||
              processInitialEmails(initialTo)
            }
            initialCc={
              // typedDraft?.cc?.map((e: string) => e.replace(/[<>]/g, "")) ||
              processInitialEmails(initialCc)
            }
            initialBcc={
              // typedDraft?.bcc?.map((e: string) => e.replace(/[<>]/g, "")) ||
              processInitialEmails(initialBcc)
            }
            initialSubject={initialSubject}
            autofocus={true}
            settingsLoading={false}
          />
        )}
      </div>
    </>
  );
}
