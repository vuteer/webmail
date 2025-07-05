import { FileText } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { format } from "date-fns";
import { Docx, Figma, ImageFile, PDF } from "@/components/icons/icons";
import { ThreadType } from "@/stores/threads";
import { toggleLocation, updateMailFlags } from "@/lib/api-calls/mails";
import { createToast } from "@/utils/toast";
import { sanitizeHtml } from "@/hooks/use-process-html";

// Helper function to clean email display
export const cleanEmailDisplay = (email?: string) => {
  if (!email) return "";
  const match = email.match(/^[^a-zA-Z]*(.*?)[^a-zA-Z]*$/);
  return match ? match[1] : email;
};

// Helper function to clean name display
export const cleanNameDisplay = (name?: string) => {
  if (!name) return "";
  return name.trim();
};

export const openAttachment = (attachment: {
  body: string;
  mimeType: string;
  filename: string;
}) => {
  try {
    const byteCharacters = atob(attachment.body);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: attachment.mimeType });
    const url = window.URL.createObjectURL(blob);

    const width = 800;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(
      url,
      "attachment-viewer",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,location=no,menubar=no`,
    );

    if (popup) {
      popup.focus();
      // Clean up the URL after a short delay to ensure the browser has time to load it
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    }
  } catch (error) {
    console.error("Error opening attachment:", error);
  }
};

// Add getFileIcon utility function
export const getFileIcon = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return <PDF className="fill-[#F43F5E]" />;
    case "jpg":
      return <ImageFile />;
    case "jpeg":
      return <ImageFile />;
    case "png":
      return <ImageFile />;
    case "gif":
      return <ImageFile />;
    case "docx":
      return <Docx />;
    case "fig":
      return <Figma />;
    case "webp":
      return <ImageFile />;
    default:
      return <FileText className="h-4 w-4 text-[#8B5CF6]" />;
  }
};

// Add formatFileSize utility function
export const formatFileSize = (size: number) => {
  const sizeInMB = (size / (1024 * 1024)).toFixed(2);
  return sizeInMB === "0.00" ? "" : `${sizeInMB} MB`;
};

export const downloadAttachment = (attachment: {
  body: string;
  mimeType: string;
  filename: string;
}) => {
  try {
    const byteCharacters = atob(attachment.body);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: attachment.mimeType });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = attachment.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading attachment:", error);
  }
};

// handleToggleFlag
export const handleToggleFlag = async (
  threadId: string | null,
  sec: string | null,
  threads: ThreadType[],
  updateThread: (messageId: string, data: Partial<ThreadType>) => void,
  flag: "\\Flagged" | "$Important",
) => {
  const thread = threads.find((t: ThreadType) => t.messageId === threadId);
  if (!thread) return;

  const isStarred = thread.flags.includes(flag);

  // 1. Optimistic update
  const previousFlags = [...thread.flags];
  const newFlags = isStarred
    ? previousFlags.filter((f) => f !== flag)
    : [...previousFlags, flag];

  const messageId = thread.messageId;
  const folder = sec || "inbox";
  const action = previousFlags.includes(flag) ? "remove" : "add";

  updateThread(messageId, { flags: newFlags });

  // 2. API call
  let actualFlag = flag === "\\Flagged" ? "Flagged" : "Important";
  const success = await updateMailFlags(messageId, folder, actualFlag, action);

  // 3. Rollback if it failed
  if (!success) {
    updateThread(messageId, { flags: previousFlags });
    // console.error("Failed to update flag on server.");
  }
};

export const includesFlag = (flag: string, flags: string[]) =>
  flags?.includes(flag);

// toggle location
export const handleToggleLocation = async (
  threadId: string,
  sec: string | null,
  folder: "archive" | "trash" | "spam" | "inbox",
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  action: "add" | "remove",
) => {
  setLoading(true);

  try {
    let res = await toggleLocation(threadId, sec || "inbox", folder, action);

    if (res) {
      createToast("Success", "Thread action was successful", "success");
      return true;
      // setThreadId(null);
      // setSec(sec === "inbox" ? "archive" : "inbox");
    }
  } catch (error) {
    console.error(error);
    createToast("Error", "Thread action was not successful", "danger");
    return false;
  } finally {
    setLoading(false);
  }
};

// HTML escaping function to prevent XSS attacks
export const escapeHtml = (text: string): string => {
  if (!text) return text;
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

// print thread
export const printThread = (mails: any[]) => {
  try {
    // Create a hidden iframe for printing
    const printFrame = document.createElement("iframe");
    printFrame.style.position = "absolute";
    printFrame.style.top = "-9999px";
    printFrame.style.left = "-9999px";
    printFrame.style.width = "0px";
    printFrame.style.height = "0px";
    printFrame.style.border = "none";

    document.body.appendChild(printFrame);

    // Generate clean, simple HTML content for printing
    const printContent = `
     <!DOCTYPE html>
     <html>
       <head>
         <meta charset="utf-8">
         <title>Print Thread - ${mails[0]?.subject || "No Subject"}</title>
         <style>
           * {
             margin: 0;
             padding: 0;
             box-sizing: border-box;
           }

           body {
             font-family: Arial, sans-serif;
             line-height: 1.5;
             color: #333;
             background: white;
             padding: 20px;
             font-size: 12px;
           }

           .email-container {
             max-width: 100%;
             margin: 0 auto;
             background: white;
           }

           .email-header {
             margin-bottom: 25px;
           }

           .email-title {
             font-size: 18px;
             font-weight: bold;
             color: #000;
             margin-bottom: 15px;
             word-wrap: break-word;
           }

           .email-meta {
             margin-bottom: 20px;
           }

           .meta-row {
             margin-bottom: 5px;
             display: flex;
             align-items: flex-start;
           }

           .meta-label {
             font-weight: bold;
             min-width: 60px;
             color: #333;
             margin-right: 10px;
           }

           .meta-value {
             flex: 1;
             word-wrap: break-word;
             color: #333;
           }

           .separator {
             width: 100%;
             height: 1px;
             background: #ddd;
             margin: 20px 0;
           }

           .email-body {
             margin: 20px 0;
             background: white;
           }

           .email-content {
             word-wrap: break-word;
             overflow-wrap: break-word;
             font-size: 12px;
             line-height: 1.6;
           }

           .email-content img {
             max-width: 100% !important;
             height: auto !important;
             display: block;
             margin: 10px 0;
           }

           .email-content table {
             width: 100%;
             border-collapse: collapse;
             margin: 10px 0;
           }

           .email-content td, .email-content th {
             padding: 6px;
             text-align: left;
             font-size: 11px;
           }

           .email-content a {
             color: #0066cc;
             text-decoration: underline;
           }

           .attachments-section {
             margin-top: 25px;
             background: white;
           }

           .attachments-title {
             font-size: 14px;
             font-weight: bold;
             color: #000;
             margin-bottom: 10px;
           }

           .attachment-item {
             margin-bottom: 5px;
             font-size: 11px;
             padding: 3px 0;
           }

           .attachment-name {
             font-weight: 500;
             color: #333;
           }

           .attachment-size {
             color: #666;
             font-size: 10px;
           }

           .labels-section {
             margin: 10px 0;
           }

           .label-badge {
             display: inline-block;
             padding: 2px 6px;
             background: #f5f5f5;
             color: #333;
             font-size: 10px;
             margin-right: 5px;
             margin-bottom: 3px;
           }

           @media print {
             body {
               margin: 0;
               padding: 15px;
               font-size: 11px;
               -webkit-print-color-adjust: exact;
               print-color-adjust: exact;
             }

             .email-container {
               max-width: none;
               width: 100%;
             }

             .separator {
               background: #000 !important;
             }

             .email-content a {
               color: #000 !important;
             }

             .label-badge {
               background: #f0f0f0 !important;
               border: 1px solid #ccc;
             }

             .no-print {
               display: none !important;
             }

             * {
               border: none !important;
               box-shadow: none !important;
             }

             .email-header {
               page-break-after: avoid;
             }

             .attachments-section {
               page-break-inside: avoid;
             }
           }

           @page {
             margin: 0.5in;
             size: A4;
           }
         </style>
       </head>
       <body>
         ${mails
           ?.map((message, index) => {
             const asFragment = <>{message.html}</>;
             let html = renderToStaticMarkup(asFragment);
             let processedHtml = sanitizeHtml(html);
             return `
                <div class="email-container">
                  <div class="email-header">
                    ${index === 0 ? `<h1 class="email-title">${message.subject || "No Subject"}</h1>` : ""}


                    ${
                      message?.tags && message.tags.length > 0
                        ? `
                      <div class="labels-section">
                        ${message.tags
                          .map(
                            (tag) => `<span class="label-badge">${tag}</span>`,
                          )
                          .join("")}
                      </div>
                    `
                        : ""
                    }


                    <div class="email-meta">
                      <div class="meta-row">
                        <span class="meta-label">From:</span>
                        <span class="meta-value">
                          ${cleanNameDisplay(message.from?.name || message.from?.email || message.from?.address)}
                          ${message.from?.email || message.from?.address ? `<${message.from.email || message.from.address}>` : ""}
                        </span>
                      </div>


                      ${
                        message.to
                          ? `
                        <div class="meta-row">
                          <span class="meta-label">To:</span>
                          <span class="meta-value">
                            ${
                              Array.isArray(message.to)
                                ? message.to
                                    .map(
                                      (recipient: any) =>
                                        `${cleanNameDisplay(recipient.name || recipient.email || recipient.address)} <${recipient.email || recipient.address || ""}>`,
                                    )
                                    .join(", ")
                                : `${cleanNameDisplay(message.to.name)} <${message.to.email || message.to.address || ""}>`
                            }
                          </span>
                        </div>
                      `
                          : ""
                      }


                      ${
                        message.cc && message.cc.length > 0
                          ? `
                        <div class="meta-row">
                          <span class="meta-label">CC:</span>
                          <span class="meta-value">
                            ${message.cc
                              .map(
                                (recipient: any) =>
                                  `${cleanNameDisplay(recipient.name || recipient.email || recipient.address)} <${recipient.email || recipient.address || ""}>`,
                              )
                              .join(", ")}
                          </span>
                        </div>
                      `
                          : ""
                      }


                      ${
                        message.bcc && message.bcc.length > 0
                          ? `
                        <div class="meta-row">
                          <span class="meta-label">BCC:</span>
                          <span class="meta-value">
                            ${message.bcc
                              .map(
                                (recipient: any) =>
                                  `${cleanNameDisplay(recipient.name || recipient.email || recipient.address)} <${recipient.email || recipient.address || ""}>`,
                              )
                              .join(", ")}
                          </span>
                        </div>
                      `
                          : ""
                      }


                      <div class="meta-row">
                        <span class="meta-label">Date:</span>
                        <span class="meta-value">${format(new Date(message.date), "PPpp")}</span>
                      </div>
                    </div>
                  </div>

                  <div class="separator"></div>

                  <div class="email-body">
                    <div class="email-content">
                      ${processedHtml || "<p><em>No email content available</em></p>"}
                    </div>
                  </div>


                  ${
                    message.attachments && message.attachments.length > 0
                      ? `
                    <div class="attachments-section">
                      <h2 class="attachments-title">Attachments (${message.attachments.length})</h2>
                      ${message.attachments
                        .map(
                          (attachment: any) => `
                        <div class="attachment-item">
                          <span class="attachment-name">${attachment.filename}</span>
                          ${formatFileSize(attachment.size) ? ` - <span class="attachment-size">${formatFileSize(attachment.size)}</span>` : ""}
                        </div>
                      `,
                        )
                        .join("")}
                    </div>
                  `
                      : ""
                  }
                </div>
                ${index < mails.length - 1 ? '<div class="separator"></div>' : ""}
              `;
           })
           .join("")}
       </body>
     </html>
   `;

    // Write content to the iframe
    const iframeDoc =
      printFrame.contentDocument || printFrame.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error("Could not access iframe document");
    }
    iframeDoc.open();
    iframeDoc.write(printContent);
    iframeDoc.close();

    // Wait for content to load, then print
    printFrame.onload = function () {
      setTimeout(() => {
        try {
          // Focus the iframe and print
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();

          // Clean up - remove the iframe after a delay
          setTimeout(() => {
            if (printFrame && printFrame.parentNode) {
              document.body.removeChild(printFrame);
            }
          }, 1000);
        } catch (error) {
          console.error("Error during print:", error);
          // Clean up on error
          if (printFrame && printFrame.parentNode) {
            document.body.removeChild(printFrame);
          }
        }
      }, 500);
    };
  } catch (error) {
    console.error("Error printing thread:", error);
    alert("Failed to print thread. Please try again.");
  }
};

// download attachment
export const handleDownloadAllAttachments =
  (
    subject: string,
    attachments: { body: string; mimeType: string; filename: string }[],
  ) =>
  async () => {
    if (!attachments.length) return;

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    console.log("attachments", attachments);
    attachments.forEach((attachment) => {
      try {
        const byteCharacters = atob(attachment.body);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        zip.file(attachment.filename, byteArray, {
          binary: true,
          date: new Date(),
          unixPermissions: 0o644,
        });
      } catch (error) {
        console.error(`Error adding ${attachment.filename} to zip:`, error);
      }
    });

    // Generate and download the zip file
    zip
      .generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9,
        },
      })
      .then((content: any) => {
        const url = window.URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = `attachments-${subject || "email"}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error: any) => {
        console.error("Error generating zip file:", error);
      });

    console.log("downloaded", subject, attachments);
  };
