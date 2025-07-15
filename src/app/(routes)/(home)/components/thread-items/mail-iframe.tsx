import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { renderToStaticMarkup } from "react-dom/server";
import { useTheme } from "next-themes";
import { fixNonReadableColors } from "@/lib/email-utils";
import {
  addStyleTags,
  doesContainStyleTags,
  template,
} from "@/lib/email-utils.client";
import { cn } from "@/lib/utils";
import { useProcessedHtml } from "@/hooks/use-process-html";

export const MailIframe = ({
  html,
  senderEmail,
}: {
  html: string;
  senderEmail: string;
}) => {
  // const isTrustedSender = useMemo(
  //   () => data?.settings?.externalImages || data?.settings?.trustedSenders?.includes(senderEmail),
  //   [data?.settings, senderEmail],
  // );

  const [cspViolation, setCspViolation] = useState(false);
  const [temporaryImagesEnabled, setTemporaryImagesEnabled] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(0);
  const { resolvedTheme } = useTheme();

  const calculateAndSetHeight = useCallback(() => {
    if (!iframeRef.current?.contentWindow?.document.body) return;

    const body = iframeRef.current.contentWindow.document.body;
    const boundingRectHeight = body.getBoundingClientRect().height;
    const scrollHeight = body.scrollHeight;

    if (body.innerText.trim() === "") {
      setHeight(0);
      return;
    }

    // Use the larger of the two values to ensure all content is visible
    const newHeight = Math.max(boundingRectHeight, scrollHeight);
    setHeight(newHeight);
  }, [iframeRef, setHeight]);

  let processedHtml = useProcessedHtml({
    reactNodes: html,
    isTrustedSender: false,
  });

  useEffect(() => {
    if (!iframeRef.current) return;
    let finalHtml = processedHtml;
    const containsStyleTags = doesContainStyleTags(processedHtml);
    if (!containsStyleTags) {
      finalHtml = addStyleTags(processedHtml);
    }

    const url = URL.createObjectURL(
      new Blob([finalHtml], { type: "text/html" }),
    );
    iframeRef.current.src = url;

    const handler = () => {
      if (iframeRef.current?.contentWindow?.document.body) {
        calculateAndSetHeight();
        fixNonReadableColors(iframeRef.current.contentWindow.document.body);
      }
      setTimeout(calculateAndSetHeight, 500);
    };

    iframeRef.current.onload = handler;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [processedHtml, calculateAndSetHeight]);

  useEffect(() => {
    if (iframeRef.current?.contentWindow?.document.body) {
      const body = iframeRef.current.contentWindow.document.body;
      body.style.backgroundColor =
        resolvedTheme === "dark"
          ? "rgba(40, 41, 49, 1)"
          : "rgba(242, 243, 246, 1) !important";
      requestAnimationFrame(() => {
        fixNonReadableColors(body);
      });
    }
  }, [resolvedTheme]);

  useEffect(() => {
    const ctrl = new AbortController();
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.type === "csp-violation") {
          setCspViolation(true);
        }
      },
      { signal: ctrl.signal },
    );

    return () => ctrl.abort();
  }, []);
  return (
    <>
      {/* {cspViolation && !isTrustedSender && !data?.settings?.externalImages && ( */}
      {cspViolation && (
        <div className="flex items-center justify-start bg-amber-600/20  py-1 text-sm text-amber-600">
          <p>Hidden Images</p>
          <button
            onClick={() => setTemporaryImagesEnabled(!temporaryImagesEnabled)}
            className="ml-2 cursor-pointer underline"
          >
            {temporaryImagesEnabled ? "Disable Images" : "Show Images"}
          </button>
          <button
            // onClick={() => void trustSender()}
            className="ml-2 cursor-pointer underline"
          >
            Trust Sender
          </button>
        </div>
      )}
      <iframe
        height={height + 2}
        ref={iframeRef}
        className={cn(
          "rounded-xl !min-h-0 w-full flex-1  overflow-hidden my-4 transition-opacity duration-200",
        )}
        title="Email Content"
        style={{
          width: "100%",
          overflow: "hidden",
        }}
      />
    </>
  );
};
