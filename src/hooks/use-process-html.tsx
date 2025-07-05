import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export const processHtml = (html: string): string => {
  let processedHtml = html;
  processedHtml = renderToStaticMarkup(<>{html}</>);
  processedHtml = sanitizeHtml(processedHtml);
  return processedHtml;
};

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
export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");
};
