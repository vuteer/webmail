import React from "react";
import { useQueryState } from "nuqs";

import { EmailCompose } from "@/components/editor/compose";
import { useDraft } from "@/hooks/use-drafts";
import { useSettings } from "@/hooks/useSettings";
import { useMailStoreState } from "@/stores/mail-store";
import { useSession } from "@/lib/auth-client";

import { sendingMail } from "@/components/editor/compose/send";

export const ReplyCompose = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const { mails, mailsLoading } = useMailStoreState();
  const [mode, setMode] = useQueryState("mode");

  const [activeReplyId, setActiveReplyId] = useQueryState("activeReplyId");
  const [draftId, setDraftId] = useQueryState("draftId");
  const [threadId] = useQueryState("threadId");
  const { draft, draftLoading } = useDraft(draftId ?? null);
  const { settings, settingsLoading } = useSettings();

  const [replyToMessage, setReplyToMessage] = React.useState<any>(null);

  React.useEffect(() => {
    if (mailsLoading || !activeReplyId) return;
    // get replyTo based on activeReplyId
    const m: any = mails.find((ml) => ml.messageId === activeReplyId);
    if (m) setReplyToMessage(m);
  }, [mails, mailsLoading, activeReplyId]);

  const handleSendEmail = async (data: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    message: string;
    attachments: File[];
  }) => {
    if (!user) return;
    const sendingUser: { email: string; name: string; image: any } = {
      email: user.email,
      name: user.name,
      image: user.image,
    };

    const res = await sendingMail(
      data,
      sendingUser,
      mode,
      "send",
      replyToMessage,
      threadId,
    );

    return res;
  };

  return (
    <div className="w-full rounded-xl">
      <EmailCompose
        editorClassName="min-h-[150px]"
        className="w-full !max-w-none border pb-1"
        onSendEmail={handleSendEmail}
        onClose={async () => {
          await setMode(null);
          await setDraftId(null);
          await setActiveReplyId(null);
        }}
        // initialMessage={draft?.content ?? latestDraft?.decodedBody}
        initialTo={
          replyToMessage
            ? [replyToMessage?.from?.email || replyToMessage?.from?.address]
            : []
        }
        initialCc={replyToMessage?.cc?.map((em: any) => em.email || em.address)}
        initialBcc={replyToMessage?.bcc?.map(
          (em: any) => em.email || em.address,
        )}
        initialSubject={replyToMessage?.subject}
        autofocus={false}
        settingsLoading={settingsLoading}
        replyingTo={replyToMessage?.from.email || replyToMessage?.from.address}
      />
    </div>
  );
};

// helper functions
//
// const ensureEmailArray = (
//   emails: string | string[] | undefined | null,
// ): string[] => {
//   if (!emails) return [];
//   if (Array.isArray(emails)) {
//     return emails.map((email) => email.trim().replace(/[<>]/g, ""));
//   }
//   if (typeof emails === "string") {
//     return emails
//       .split(",")
//       .map((email) => email.trim())
//       .filter((email) => email.length > 0)
//       .map((email) => email.replace(/[<>]/g, ""));
//   }
//   return [];
// };
