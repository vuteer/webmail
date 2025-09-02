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
    inReplyTo?: string | null;
    references?: string;
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

    let serializedFiles: any = [];

    for (let i = 0; i < data.attachments.length; i++) {
      let att: any = data.attachments[i];
      if (att.content?.type === "Buffer" || att.base64) {
        serializedFiles.push({
          base64:
            att.base64 ||
            `data:${att.content.type};base64,${Buffer.from(att.content.data).toString("base64")}`,
          name: att.name || att.filename,
          size: att.size,
          type: att.type || att.contentType,
          lastModified: att.lastModified || Date.now(),
        });
      } else {
        const fileArray = await serializeFiles([att]);
        serializedFiles.push(fileArray[0]);
      }
    }

    const mail = {
      to: toRecipients,
      cc: ccRecipients,
      bcc: bccRecipients,
      subject: data.subject,
      message: emailBody,
      from: { address: fromEmail, name: userName },
      attachments: serializedFiles,
      draftId: data.draftId ?? null,
      inReplyTo: data.inReplyTo ?? null,
      headers: {
        "In-Reply-To": mode === "forward" ? "" : data.inReplyTo,
        References: mode === "forward" ? [] : data.references,
        "Thread-Id":
          mode === "compose" || mode === "forward" ? "" : (threadId ?? ""),
      },
      threadId: mode === "compose" ? "" : threadId,
      isForward: mode === "forward",
      originalMessage: decodeHtmlToText(
        processHtml(replyToMessage?.html || ""),
      ),
    };

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
