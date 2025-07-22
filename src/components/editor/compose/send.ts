import { serializeFiles } from "@/lib/schemas";
import { createDraft, sendMail } from "@/lib/api-calls/mails";
import {
  constructForwardBody,
  constructMailBody,
  constructReplyBody,
  decodeHtmlToText,
  stripHtmlTags,
} from "@/lib/utils";
import { processHtml } from "@/hooks/use-process-html";
import { createToast } from "@/utils/toast";

export const sendingMail = async (
  data: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    message: string;
    attachments: File[];
    draftId?: string | null;
  },
  user: { email: string; name: string; image: any },
  mode?: string | null,
  type?: "draft" | "send" | null,
  replyToMessage?: any,
  threadId?: string | null,
) => {
  try {
    const { email, name, image } = user;
    const fromEmail = email;
    const userName = name;
    const userImage = image;

    if (!stripHtmlTags(data.message) && data.attachments.length === 0) {
      throw new Error("Mail Body or Attachments Required!");
    }
    // Send email logic here
    // to, cc, bcc
    let toRecipients = data.to.map((email) => ({
      email,
      address: email,
      name: email.split("@")[0] || "User",
    }));

    toRecipients = toRecipients.filter((to) => to !== null);

    if (toRecipients.length === 0) {
      throw new Error("No valid recipients");
    }

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
    const emailBody = !replyToMessage
      ? constructMailBody(data.message + signature)
      : mode === "forward"
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
      draftId: data.draftId ?? null,
      headers: {
        "In-Reply-To": replyToMessage?.messageId ?? "",
        References: [
          ...(replyToMessage?.references?.length
            ? replyToMessage?.references?.split(" ")
            : []),
          replyToMessage?.messageId,
        ]
          .filter(Boolean)
          .join(" "),
        "Thread-Id": threadId ?? "",
      },
      threadId: threadId,
      isForward: mode === "forward",
      originalMessage: decodeHtmlToText(
        processHtml(replyToMessage?.html || ""),
      ),
    };

    console.log(mail);
    let res: any;
    if (type === "draft") res = await createDraft(mail);
    else res = await sendMail(mail);

    if (type !== "draft")
      createToast("Success", "Mail sent successfully!", "success");
    return res;
  } catch (error: any) {
    console.log(error);
    createToast("Error", error.message || "Error sending mail", "danger");
    return false;
  }
};
