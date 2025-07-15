import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Column,
  Row,
} from "@react-email/components";

import { renderToString } from "react-dom/server";

export const highlightText = (text: string, highlight: string) => {
  if (!highlight?.trim()) return text;

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) => {
    return i % 2 === 1 ? (
      <span
        key={i}
        className="ring-0.5 bg-primary/10 inline-flex items-center justify-center rounded px-1"
      >
        {part}
      </span>
    ) : (
      part
    );
  });
};

interface EmailTemplateProps {
  content: string;
  imagesEnabled: boolean;
  nonce: string;
}

const generateNonce = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

const forceExternalLinks = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const links = doc.querySelectorAll('a:not([target="_blank"])');
  links.forEach((link) => {
    link.setAttribute("target", "_blank");
  });

  return doc.body.innerHTML;
};

const getProxiedUrl = (url: string) => {
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;

  const proxyUrl = import.meta.env.VITE_PUBLIC_IMAGE_PROXY?.trim();
  if (!proxyUrl) return url;

  return proxyUrl + encodeURIComponent(url);
};

const proxyImageUrls = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    if (!src) return;

    const proxiedUrl = getProxiedUrl(src);
    if (proxiedUrl !== src) {
      img.setAttribute("data-original-src", src);
      img.setAttribute("src", proxiedUrl);
      img.setAttribute(
        "onerror",
        `this.onerror=null; this.src=this.getAttribute('data-original-src');`,
      );
    }
  });

  doc.querySelectorAll('[style*="background-image"]').forEach((element) => {
    const style = element.getAttribute("style");
    if (!style) return;

    const newStyle = style.replace(
      /background-image:\s*url\(['"]?(.*?)['"]?\)/g,
      (match, url) => {
        const proxiedUrl = getProxiedUrl(url);
        if (proxiedUrl !== url) {
          element.setAttribute("data-original-bg", url);
          return `background-image: url('${proxiedUrl}')`;
        }
        return match;
      },
    );
    element.setAttribute("style", newStyle);
  });

  return doc.body.innerHTML;
};

const EmailTemplate = ({
  content,
  imagesEnabled,
  nonce,
}: EmailTemplateProps) => {
  return (
    <Html>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content={
            imagesEnabled
              ? `default-src 'none'; img-src * data: blob: 'unsafe-inline'; style-src 'unsafe-inline' *; font-src *; script-src 'nonce-${nonce}';`
              : `default-src 'none'; img-src data:; style-src 'unsafe-inline' *; font-src *; script-src 'nonce-${nonce}';`
          }
        />
        <script nonce={nonce}>
          {`
            document.addEventListener('securitypolicyviolation', (e) => {
              // Send the violation details to the parent window
              window.parent.postMessage({
                type: 'csp-violation',
              }, '*');
            });
          `}
        </script>
      </Head>
      <Body style={{ margin: 0, padding: 0, background: "transparent" }}>
        <Container
          style={{
            width: "100%",
            maxWidth: "100%",
            background: "transparent",
            padding: 0,
            margin: 0,
          }}
        >
          <Section style={{ width: "100%", background: "transparent" }}>
            <Row style={{ background: "transparent" }}>
              <Column style={{ background: "transparent" }}>
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const doesContainStyleTags = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.querySelectorAll("style").length > 0;
};

export const addStyleTags = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const style = doc.createElement("style");
  style.textContent = `
    :root {
      --background: #FFFFFF;
      --text: #1A1A1A;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --background: #1A1A1A;
        --text: #FFFFFF;
      }
    }

    body {
      font-family: 'Geist', sans-serif !important;
      background-color: var(--background) !important;
      color: var(--text) !important;
    }
  `;

  doc.head.appendChild(style);
  return doc.documentElement.outerHTML;
};

export const template = async (
  html: string,
  imagesEnabled: boolean = false,
) => {
  console.time("[template] template");
  if (typeof DOMParser === "undefined") return html;
  const nonce = generateNonce();
  let processedHtml = forceExternalLinks(html);

  if (imagesEnabled) {
    console.time("[template] proxyImageUrls");
    processedHtml = proxyImageUrls(processedHtml);
    console.timeEnd("[template] proxyImageUrls");
  }

  console.time("[template] renderToString");
  const emailHtml = renderToString(
    <EmailTemplate
      content={processedHtml}
      imagesEnabled={imagesEnabled}
      nonce={nonce}
    />,
  );
  console.timeEnd("[template] renderToString");
  console.timeEnd("[template] template");
  return emailHtml;
};
