import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  isToday,
  isThisMonth,
  differenceInCalendarMonths,
} from "date-fns";
import { getBrowserTimezone } from "./timezones";
import { formatInTimeZone } from "date-fns-tz";
import { MAX_URL_LENGTH } from "./constants";
import type { Sender } from "@/types";
import LZString from "lz-string";
import { convert } from "html-to-text";
import sanitizeHtml from "sanitize-html";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FOLDERS = {
  SPAM: "spam",
  INBOX: "inbox",
  ARCHIVE: "archive",
  BIN: "bin",
  DRAFT: "draft",
  SENT: "sent",
} as const;

export const LABELS = {
  SPAM: "SPAM",
  INBOX: "INBOX",
  UNREAD: "UNREAD",
  IMPORTANT: "IMPORTANT",
  SENT: "SENT",
  TRASH: "TRASH",
} as const;

export const FOLDER_NAMES = [
  "inbox",
  "spam",
  "bin",
  "unread",
  "starred",
  "important",
  "sent",
  "draft",
];

export const FOLDER_TAGS: Record<string, string[]> = {
  [FOLDERS.SPAM]: [LABELS.SPAM],
  [FOLDERS.INBOX]: [LABELS.INBOX],
  [FOLDERS.ARCHIVE]: [],
  [FOLDERS.SENT]: [LABELS.SENT],
  [FOLDERS.BIN]: [LABELS.TRASH],
};

export const getFolderTags = (folder: string): string[] => {
  return FOLDER_TAGS[folder] || [];
};

export const compressText = (text: string): string => {
  const compressed = LZString.compressToEncodedURIComponent(text);
  return compressed.slice(0, MAX_URL_LENGTH);
};

export const decompressText = (compressed: string): string => {
  return LZString.decompressFromEncodedURIComponent(compressed) || "";
};

export const getCookie = (key: string): string | null => {
  const cookies = Object.fromEntries(
    document.cookie
      .split("; ")
      .map((v) => v.split("/=(.*)/s").map(decodeURIComponent)),
  );
  return cookies?.[key] ?? null;
};

export const formatDate = (date: string) => {
  try {
    // Handle empty or invalid input
    if (!date) {
      return "";
    }

    const timezone = getBrowserTimezone();
    // Parse the date string to a Date object
    const dateObj = new Date(date);
    const now = new Date();

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date", date);
      return "";
    }

    // If it's today, always show the time
    if (isToday(dateObj)) {
      return formatInTimeZone(dateObj, timezone, "h:mm a");
    }

    // Calculate hours difference between now and the email date
    const hoursDifference =
      (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);

    // If it's not today but within the last 12 hours, show the time
    if (hoursDifference <= 12) {
      return formatInTimeZone(dateObj, timezone, "h:mm a");
    }

    // If it's this month or last month, show the month and day
    if (
      isThisMonth(dateObj) ||
      differenceInCalendarMonths(now, dateObj) === 1
    ) {
      return formatInTimeZone(dateObj, timezone, "MMM dd");
    }

    // Otherwise show the date in MM/DD/YY format
    return formatInTimeZone(dateObj, timezone, "MM/dd/yy");
  } catch (error) {
    console.error("Error formatting date", error);
    return "";
  }
};

export const cleanEmailAddress = (email: string = "") => {
  return email.replace(/[<>]/g, "").trim();
};

export const truncateFileName = (name: string, maxLength = 15) => {
  if (name.length <= maxLength) return name;
  const extIndex = name.lastIndexOf(".");
  if (extIndex !== -1 && name.length - extIndex <= 5) {
    return `${name.slice(0, maxLength - 5)}...${name.slice(extIndex)}`;
  }
  return `${name.slice(0, maxLength)}...`;
};

export type FilterSuggestion = {
  filter: string;
  description: string;
  icon: React.ReactNode;
  prefix: string;
};

export const extractFilterValue = (filter: string): string => {
  if (!filter || !filter.includes(":")) return "";

  const colonIndex = filter.indexOf(":");
  const value = filter.substring(colonIndex + 1);

  return value || "";
};

export const defaultPageSize = 20;

export function createSectionId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileIcon = (mimeType: string): string => {
  if (mimeType === "application/pdf") return "📄";
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
    return "📊";
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "📝";
  if (mimeType.includes("image")) return ""; // Empty for images as they're handled separately
  return "📎"; // Default icon
};

export const convertJSONToHTML = (json: any): string => {
  if (!json) return "";

  // Handle different types
  if (typeof json === "string") return json;
  if (typeof json === "number" || typeof json === "boolean")
    return json.toString();
  if (json === null) return "";

  // Handle arrays
  if (Array.isArray(json)) {
    return json.map((item) => convertJSONToHTML(item)).join("");
  }

  // Handle objects (assuming they might have specific email content structure)
  if (typeof json === "object") {
    // Check if it's a text node
    if (json.type === "text") {
      let text = json.text || "";

      // Apply formatting if present
      if (json.bold) text = `<strong>${text}</strong>`;
      if (json.italic) text = `<em>${text}</em>`;
      if (json.underline) text = `<u>${text}</u>`;
      if (json.code) text = `<code>${text}</code>`;

      return text;
    }

    // Handle paragraph
    if (json.type === "paragraph") {
      return `<p>${convertJSONToHTML(json.children)}</p>`;
    }

    // Handle headings
    if (json.type?.startsWith("heading-")) {
      const level = json.type.split("-")[1];
      return `<h${level}>${convertJSONToHTML(json.children)}</h${level}>`;
    }

    // Handle lists
    if (json.type === "bulleted-list") {
      return `<ul>${convertJSONToHTML(json.children)}</ul>`;
    }

    if (json.type === "numbered-list") {
      return `<ol>${convertJSONToHTML(json.children)}</ol>`;
    }

    if (json.type === "list-item") {
      return `<li>${convertJSONToHTML(json.children)}</li>`;
    }

    // Handle links
    if (json.type === "link") {
      return `<a href="${json.url}">${convertJSONToHTML(json.children)}</a>`;
    }

    // Handle images
    if (json.type === "image") {
      return `<img src="${json.url}" alt="${json.alt || ""}" />`;
    }

    // Handle blockquote
    if (json.type === "block-quote") {
      return `<blockquote>${convertJSONToHTML(json.children)}</blockquote>`;
    }

    // Handle code blocks
    if (json.type === "code-block") {
      return `<pre><code>${convertJSONToHTML(json.children)}</code></pre>`;
    }

    // If it has children property, process it
    if (json.children) {
      return convertJSONToHTML(json.children);
    }

    // Process all other properties
    return Object.values(json)
      .map((value) => convertJSONToHTML(value))
      .join("");
  }

  return "";
};

// export const getEmailLogo = (email: string) => {
//   if (!import.meta.env.VITE_PUBLIC_IMAGE_API_URL) return '';
//   return import.meta.env.VITE_PUBLIC_IMAGE_API_URL + email;
// };

export const generateConversationId = (): string => {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const contentToHTML = (content: string) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin: 0; padding: 0; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
${content}
</body></html>`;

export const constructMailBody = (formattedMessage: string) => {
  return contentToHTML(`

      <div style="padding: 7px">
        ${formattedMessage}
      </div>

  `);
};
export const constructReplyBody = (
  formattedMessage: string,
  originalDate: string,
  originalSender: Sender | undefined,
  otherRecipients: Sender[],
  quotedMessage?: string,
) => {
  const senderName =
    originalSender?.name ||
    originalSender?.email ||
    originalSender?.address ||
    "Unknown Sender";
  const recipientEmails = otherRecipients.map((r) => r.email).join(", ");

  return contentToHTML(`
    <div style="padding: 7px">
      <div >
        ${formattedMessage}
      </div>
      <div style="padding-left: 16px; border-left: 3px solid #e2e8f0; color: #64748b;">
        <div style="font-size: 12px;">
          On ${originalDate}, ${senderName} ${recipientEmails ? `&lt;${recipientEmails}&gt;` : ""} wrote:
          <span style="text-decoration: italic;">
            ${quotedMessage || "Unavailable Text"}
          </span>
        </div>
      </div>
    </div>
  `);
};
const cleanEmailHtml = (input: string): string => {
  if (!input) return "";

  // 1. Escape email addresses in angle brackets (<foo@bar.com> → &lt;foo@bar.com&gt;)
  // const escaped = input.replace(/<([^\s>]+@[^\s>]+)>/g, "&lt;$1&gt;");

  // 2. Sanitize out unwanted <html>, <head>, <body>, <meta> tags
  return sanitizeHtml(input, {
    allowedTags: false, // keep normal tags
    disallowedTagsMode: "discard",
    exclusiveFilter: (frame) =>
      ["html", "head", "body", "meta", "!doctype"].includes(frame.tag),
  });
};
function extractBodyChildren(html: string) {
  // Parse the HTML into a DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Get all body children
  const bodyChildren = doc.body.children;

  // Return their HTML content combined
  let result = "";
  for (let child of bodyChildren) {
    result += child.outerHTML + "\n";
  }

  return result.trim();
}
export const constructForwardBody = (
  formattedMessage: string,
  originalDate: string,
  originalSender: Sender | undefined,
  otherRecipients: Sender[],
  quotedMessage?: string,
) => {
  const senderName =
    originalSender?.name || originalSender?.email || "Unknown Sender";
  const recipientEmails = otherRecipients.map((r) => r.email).join(", ");

  return contentToHTML(`
    <div style="padding: 7px">
      <div style="">
        ${extractBodyChildren(formattedMessage)}
      </div>
      <div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        <div style="font-size: 12px; color: #64748b; margin-bottom: 10px;">
          ---------- Forwarded message ----------<br/>
          From: ${senderName} ${originalSender?.email ? `&lt;${originalSender.email}&gt;` : ""}<br/>
          Date: ${originalDate}<br/>
          Subject: ${originalSender?.subject || "No Subject"}<br/>
          To: ${recipientEmails || "No Recipients"}

        </div>
      </div>
    </div>
  `);
};

// export const constructForwardBody = (
//   formattedMessage: string,
//   originalDate: string,
//   originalSender: Sender | undefined,
//   otherRecipients: Sender[],
//   quotedMessage?: string,
// ) => {
//   const senderName =
//     originalSender?.name || originalSender?.email || "Unknown Sender";
//   const recipientEmails = otherRecipients.map((r) => r.email).join(", ");

//   return contentToHTML(`
//     <div style="padding: 7px">
//       <div style="">
//         ${formattedMessage}
//       </div>
//       <div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
//         <div style="font-size: 12px; color: #64748b; margin-bottom: 10px;">
//           ---------- Forwarded message ----------<br/>
//           From: ${senderName} ${originalSender?.email ? `&lt;${originalSender.email}&gt;` : ""}<br/>
//           Date: ${originalDate}<br/>
//           Subject: ${originalSender?.subject || "No Subject"}<br/>
//           To: ${recipientEmails || "No Recipients"}
//           <p style="text-decoration: italic;">
//             ${quotedMessage?.slice(0, 300)}
//           </p>
//         </div>
//       </div>
//     </div>
//   `);
// };

export function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export const getMainSearchTerm = (searchQuery: string): string => {
  // Don't highlight terms if this is a date-based search
  const datePatterns = [
    /emails?\s+from\s+(\w+)\s+(\d{4})/i, // "emails from [month] [year]"
    /emails?\s+from\s+(\w+)/i, // "emails from [month]"
    /emails?\s+from\s+(\d{4})/i, // "emails from [year]"
    /emails?\s+from\s+last\s+(\w+)/i, // "emails from last [time period]"
    /emails?\s+from\s+(\d+)\s+(\w+)\s+ago/i, // "emails from [X] [time period] ago"
  ];

  // If it's a date-based search, don't highlight anything
  for (const pattern of datePatterns) {
    if (searchQuery.match(pattern)) {
      return "";
    }
  }

  // Handle other natural language queries
  const naturalLanguageMatches = {
    "emails from": /emails?\s+from\s+(\w+)/i,
    "mail from": /mail\s+from\s+(\w+)/i,
    from: /\bfrom\s+(\w+)/i,
    to: /\bto\s+(\w+)/i,
    about: /\babout\s+(\w+)/i,
    regarding: /\bregarding\s+(\w+)/i,
  };

  // Try to match natural language patterns
  for (const [, pattern] of Object.entries(naturalLanguageMatches)) {
    const match = searchQuery.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If no natural language match, remove search operators and date-related terms
  const cleanedQuery = searchQuery
    .replace(/\b(from|to|subject|has|in|after|before):\s*/gi, "")
    .replace(/\b(is|has):\s*/gi, "")
    .replace(
      /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/gi,
      "",
    )
    .replace(/\b\d{4}\b/g, "") // Remove 4-digit years
    .replace(/["']/g, "")
    .trim();

  // Split by spaces and get the first meaningful term
  const terms = cleanedQuery.split(/\s+/);
  return terms[0] || "";
};

export function parseNaturalLanguageSearch(query: string): string {
  // Common search patterns
  const patterns = [
    // From pattern
    {
      regex: /^from\s+([^:\s]+)/i,
      transform: (match: string[]) => `from:${match[1]}`,
    },
    // To pattern
    {
      regex: /^to\s+([^:\s]+)/i,
      transform: (match: string[]) => `to:${match[1]}`,
    },
    // Subject pattern
    {
      regex: /^subject\s+([^:\s]+)/i,
      transform: (match: string[]) => `subject:${match[1]}`,
    },
    // Has attachment pattern
    {
      regex: /^has\s+(attachment|file)/i,
      transform: () => "has:attachment",
    },
    // Is pattern (unread, read, starred)
    {
      regex: /^is\s+(unread|read|starred)/i,
      transform: (match: string[]) => `is:${match[1]}`,
    },
  ];

  // Check if query matches any pattern
  for (const pattern of patterns) {
    const match = query.match(pattern.regex);
    if (match) {
      return pattern.transform(match);
    }
  }

  return query;
}

export function parseNaturalLanguageDate(
  query: string,
): { from?: Date; to?: Date } | null {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Common date patterns
  const patterns = [
    // "emails from [month] [year]"
    {
      regex: /(?:emails?|mail)\s+from\s+(\w+)\s+(\d{4})/i,
      transform: (match: string[]) => {
        const monthNames = [
          "january",
          "february",
          "march",
          "april",
          "may",
          "june",
          "july",
          "august",
          "september",
          "october",
          "november",
          "december",
        ];
        const monthIndex = monthNames.findIndex((m) =>
          m.toLowerCase().startsWith(match[1]?.toLowerCase() ?? ""),
        );
        if (monthIndex === -1) return null;

        const year = parseInt(match[2] ?? currentYear.toString());
        const from = new Date(year, monthIndex, 1);
        const to = new Date(year, monthIndex + 1, 0); // Last day of the month
        return { from, to };
      },
    },
    // "emails from [month]" (assumes current year)
    {
      regex: /(?:emails?|mail)\s+from\s+(\w+)/i,
      transform: (match: string[]) => {
        const monthNames = [
          "january",
          "february",
          "march",
          "april",
          "may",
          "june",
          "july",
          "august",
          "september",
          "october",
          "november",
          "december",
        ];
        const monthIndex = monthNames.findIndex((m) =>
          m.toLowerCase().startsWith(match[1]?.toLowerCase() ?? ""),
        );
        if (monthIndex === -1) return null;

        const from = new Date(currentYear, monthIndex, 1);
        const to = new Date(currentYear, monthIndex + 1, 0); // Last day of the month
        return { from, to };
      },
    },
  ];

  // Check if query matches any pattern
  for (const pattern of patterns) {
    const match = query.match(pattern.regex);
    if (match) {
      const result = pattern.transform(match);
      if (result) {
        return result;
      }
    }
  }

  return null;
}

export const categorySearchValues = [
  "is:important NOT is:sent NOT is:draft",
  "NOT is:draft (is:inbox OR (is:sent AND to:me))",
  "is:personal NOT is:sent NOT is:draft",
  "is:updates NOT is:sent NOT is:draft",
  "is:promotions NOT is:sent NOT is:draft",
  "is:unread NOT is:sent NOT is:draft",
];

export const cleanSearchValue = (q: string): string => {
  const escapedValues = categorySearchValues.map((value) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  return q
    .replace(new RegExp(escapedValues.join("|"), "g"), "")
    .replace(/\s+/g, " ")
    .trim();
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const withExponentialBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
  maxDelay = 10000,
): Promise<T> => {
  let retries = 0;
  let delayMs = initialDelay;

  while (true) {
    try {
      return await operation();
    } catch (error: any) {
      if (retries >= maxRetries) {
        throw error;
      }

      const isRateLimit =
        error?.code === 429 ||
        error?.errors?.[0]?.reason === "rateLimitExceeded" ||
        error?.errors?.[0]?.reason === "userRateLimitExceeded";

      if (!isRateLimit) {
        throw error;
      }

      await delay(delayMs);

      delayMs = Math.min(delayMs * 2 + Math.random() * 1000, maxDelay);
      retries++;
    }
  }
};

// validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// decode html to text
export function decodeHtmlToText(html: unknown): string {
  if (typeof html !== "string") return "";

  return convert(html, {
    wordwrap: false,
    selectors: [{ selector: "a", options: { ignoreHref: true } }],
  });
}
