import React from "react";
import { useQueryState } from "nuqs";

import { EmailCompose } from "@/components/editor/compose";
// import { useDraft } from "@/hooks/use-drafts";
// import { useSettings } from "@/hooks/useSettings";
import { useMailStoreState } from "@/stores/mail-store";
import { useSession } from "@/lib/auth-client";

import { sendingMail } from "@/components/editor/compose/send";
import { jsxToHtml } from "@/components/editor/compose/jsx-to-html";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMobile";

export const ReplyCompose = () => {
  const { data: session } = useSession();
  const isMobile = useIsMobile();
  const user = session?.user;

  const { mails, mailsLoading } = useMailStoreState();
  const [mode, setMode] = useQueryState("mode");

  const [activeReplyId, setActiveReplyId] = useQueryState("activeReplyId");
  const [threadId] = useQueryState("threadId");

  const [replyToMessage, setReplyToMessage] = React.useState<any>(null);

  React.useEffect(() => {
    if (mailsLoading || !activeReplyId) return;
    // get replyTo based on activeReplyId
    if (mode === "replyAll") {
      setReplyToMessage(mails[0]);
    } else {
      const m: any = mails.find((ml) => ml._id === activeReplyId);
      if (m) setReplyToMessage(m);
    }
  }, [mails, mailsLoading, activeReplyId]);

  const handleSendEmail = async (data: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    inReplyTo?: string;
    references?: string;
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
    <div className={cn("w-full rounded-xl")}>
      <EmailCompose
        editorClassName={isMobile ? "min-h-[130px]" : "min-h-[150px]"}
        className="w-full !max-w-none border pb-1"
        onSendEmail={handleSendEmail}
        onClose={async () => {
          await setMode(null);
          // await setDraftId(null);
          await setActiveReplyId(null);
        }}
        initialMessage={
          replyToMessage?.html && (mode === "forward" || mode === "draft")
            ? jsxToHtml(replyToMessage.html)
            : ""
        }
        initialTo={
          replyToMessage
            ? mode == "forward"
              ? []
              : mode == "reply"
                ? user?.email ===
                  (replyToMessage?.to[0]?.email ||
                    replyToMessage?.to[0]?.address)
                  ? [replyToMessage?.from?.address]
                  : [replyToMessage?.to[0]?.address]
                : [replyToMessage?.from?.email || replyToMessage?.from?.address]
            : []
        }
        initialAttachments={replyToMessage?.attachments.map(
          (attachment: any) => ({
            base64: `data:${attachment.content.type};base64,${Buffer.from(attachment.content.data).toString("base64")}`,
            name: attachment.filename,
            size: attachment.size,
            type: attachment.contentType,
            lastModified: Date.now(),
            context: "draft",
          }),
        )}
        initialCc={replyToMessage?.cc?.map((em: any) => em.email || em.address)}
        initialBcc={replyToMessage?.bcc?.map(
          (em: any) => em.email || em.address,
        )}
        initialSubject={replyToMessage?.subject}
        autofocus={false}
        settingsLoading={false}
        replyingTo={replyToMessage?.from.email || replyToMessage?.from.address}
      />
    </div>
  );
};
