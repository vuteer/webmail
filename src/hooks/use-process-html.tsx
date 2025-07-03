import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export const useProcessedHtml = ({
  reactNodes,
  isTrustedSender = false,
  temporaryImagesEnabled = false,
}: {
  reactNodes: (string | JSX.Element)[];
  isTrustedSender?: boolean;
  temporaryImagesEnabled?: boolean;
}) => {
  const [htmlString, setHtmlString] = useState<string>("");

  useEffect(() => {
    if (!reactNodes || reactNodes.length === 0) return;

    const asFragment = <>{reactNodes}</>;

    let html = renderToStaticMarkup(asFragment);

    if (!isTrustedSender && !temporaryImagesEnabled) {
      html = sanitizeHtml(html);
    }

    setHtmlString(html);
  }, [reactNodes, isTrustedSender, temporaryImagesEnabled]);

  return htmlString;
};

// Optional basic sanitizer
const sanitizeHtml = (html: string): string => {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");
};
