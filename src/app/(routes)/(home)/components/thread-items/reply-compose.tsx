import React from "react";
import { useQueryState } from "nuqs";

// import { EmailComposer } from "@/components/editor2/email-compose";
import { EmailCompose } from "@/components/editor2/compose";
import { useDraft } from "@/hooks/use-drafts";
import { useSettings } from "@/hooks/useSettings";
import { useMailStoreState } from "@/stores/mail-store";
import { useSession } from "@/lib/auth-client";
import {
  constructReplyBody,
  constructForwardBody,
  decodeHtmlToText,
} from "@/lib/utils";
import { serializeFiles } from "@/lib/schemas";
import { processHtml } from "@/hooks/use-process-html";
import { sendMail } from "@/lib/api-calls/mails";

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

  console.log(replyToMessage);

  // process html from previous message

  const handleSendEmail = async (data: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    message: string;
    attachments: File[];
  }) => {
    console.log(data, "here");
    if (!replyToMessage || !user) return;
    try {
      // current user
      const { email, name, image } = user;
      const fromEmail = email;
      const userName = name;
      const userImage = image;

      // to, cc, bcc
      const toRecipients = data.to.map((email) => ({
        email,
        address: email,
        name: email.split("@")[0] || "User",
      }));
      const ccRecipients = data.cc
        ? data.cc.map((email) => ({
            email,
            address: email,
            name: email.split("@")[0] || "User",
          }))
        : undefined;
      const bccRecipients = data.bcc
        ? data.bcc.map((email) => ({
            email,
            address: email,
            name: email.split("@")[0] || "User",
          }))
        : undefined;

      // signature attach here - get from server or settings html
      const signature = "";

      // body
      const emailBody =
        mode === "forward"
          ? constructForwardBody(
              data.message + signature,
              new Date(replyToMessage.date || "").toLocaleString(),
              { ...replyToMessage.from, subject: replyToMessage.subject },
              toRecipients,
              processHtml(replyToMessage?.html || ""),
            )
          : constructReplyBody(
              data.message + signature,
              new Date(replyToMessage.date || "").toLocaleString(),
              replyToMessage.from,
              toRecipients,
              processHtml(replyToMessage?.html || ""),
            );

      let serializedFiles = await serializeFiles(data.attachments);
      const mail = {
        to: toRecipients,
        cc: ccRecipients,
        bcc: bccRecipients,
        subject: data.subject,
        message: emailBody,
        from: { address: fromEmail, name: userName },
        attachments: serializedFiles,
        headers: {
          "In-Reply-To": replyToMessage?.messageId ?? "",
          References: [
            ...(replyToMessage?.references
              ? replyToMessage.references.split(" ")
              : []),
            replyToMessage?.messageId,
          ]
            .filter(Boolean)
            .join(" "),
          "Thread-Id": replyToMessage?.threadId ?? "",
        },
        threadId: threadId,
        isForward: mode === "forward",
        originalMessage: decodeHtmlToText(
          processHtml(replyToMessage?.html || ""),
        ),
      };

      await sendMail(mail);
      // console.log(mail);
    } catch (error) {
      console.error(error);
    } finally {
    }
    // try {
    //   const userEmail = activeConnection.email.toLowerCase();
    //   const userName = activeConnection.name || session?.user?.name || '';
    //   let fromEmail = userEmail;

    //   const toRecipients: Sender[] = data.to.map((email) => ({
    //     email,
    //     name: email.split('@')[0] || 'User',
    //   }));
    //   const ccRecipients: Sender[] | undefined = data.cc
    //     ? data.cc.map((email) => ({
    //         email,
    //         name: email.split('@')[0] || 'User',
    //       }))
    //     : undefined;
    //   const bccRecipients: Sender[] | undefined = data.bcc
    //     ? data.bcc.map((email) => ({
    //         email,
    //         name: email.split('@')[0] || 'User',
    //       }))
    //     : undefined;
    //   const zeroSignature = settings?.settings.zeroSignature
    //     ? '<p style="color: #666; font-size: 12px;">Sent via <a href="https://0.email/" style="color: #0066cc; text-decoration: none;">Zero</a></p>'
    //     : '';
    //   const emailBody =
    //     mode === 'forward'
    //       ? constructForwardBody(
    //           data.message + zeroSignature,
    //           new Date(replyToMessage.receivedOn || '').toLocaleString(),
    //           { ...replyToMessage.sender, subject: replyToMessage.subject },
    //           toRecipients,
    //           replyToMessage.decodedBody,
    //         )
    //       : constructReplyBody(
    //           data.message + zeroSignature,
    //           new Date(replyToMessage.receivedOn || '').toLocaleString(),
    //           replyToMessage.sender,
    //           toRecipients,
    //           replyToMessage.decodedBody,
    //         );
    // await sendEmail({
    //   to: toRecipients,
    //   cc: ccRecipients,
    //   bcc: bccRecipients,
    //   subject: data.subject,
    //   message: emailBody,
    //   attachments: await serializeFiles(data.attachments),
    //   fromEmail: fromEmail,
    //   headers: {
    //     'In-Reply-To': replyToMessage?.messageId ?? '',
    //     References: [
    //       ...(replyToMessage?.references ? replyToMessage.references.split(' ') : []),
    //       replyToMessage?.messageId,
    //     ]
    //       .filter(Boolean)
    //       .join(' '),
    //     'Thread-Id': replyToMessage?.threadId ?? '',
    //   },
    //   threadId: replyToMessage?.threadId,
    //   isForward: mode === 'forward',
    //   originalMessage: replyToMessage.decodedBody,
    // });
    // posthog.capture('Reply Email Sent');
    // Reset states
    //   setMode(null);
    //   await refetch();
    //   toast.success(m['pages.createEmail.emailSent']());
    // } catch (error) {
    //   console.error('Error sending email:', error);
    //   toast.error(m['pages.createEmail.failedToSendEmail']());
    // }
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
const ensureEmailArray = (
  emails: string | string[] | undefined | null,
): string[] => {
  if (!emails) return [];
  if (Array.isArray(emails)) {
    return emails.map((email) => email.trim().replace(/[<>]/g, ""));
  }
  if (typeof emails === "string") {
    return emails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0)
      .map((email) => email.replace(/[<>]/g, ""));
  }
  return [];
};
