type HtmlNode =
  | string
  | {
      type: string;
      props?: { [key: string]: any };
      children?: HtmlNode | HtmlNode[];
    };

// Function to recursively convert the JSX-like object to an HTML string
export function jsxToHtml(input: HtmlNode | HtmlNode[]): string {
  if (typeof input === "string") {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(jsxToHtml).join("");
  }

  const { type, props = {} } = input;

  // Extract children
  const children = props.children ?? [];
  const innerHtml = jsxToHtml(Array.isArray(children) ? children : [children]);

  // Build attributes
  const attributes = Object.entries(props)
    .filter(([key]) => key !== "children")
    .map(([key, value]) => ` ${key}="${value}"`)
    .join("");

  return `<${type}${attributes}>${innerHtml}</${type}>`;
}

export function cleanHtmlForTiptap(html: string): string {
  // Step 0: Escape invalid tags like <jacob@sokoetu.com>
  const safeHtml = html.replace(/<([^>\s\/]+@[^>\s]+)>/g, (_, email) => {
    return `&lt;${email}&gt;`;
  });

  console.log(safeHtml);

  const parser = new DOMParser();
  const doc = parser.parseFromString(safeHtml, "text/html");

  // Remove style, script, meta, head
  doc
    .querySelectorAll("style, script, meta, head")
    .forEach((el) => el.remove());

  // Unwrap <p> containing block elements
  doc.querySelectorAll("p").forEach((p) => {
    const hasBlock = Array.from(p.children).some((child) =>
      ["DIV", "SECTION", "ARTICLE", "TABLE", "P"].includes(child.tagName),
    );
    if (hasBlock) {
      const parent = p.parentElement;
      if (!parent) return;
      while (p.firstChild) {
        parent.insertBefore(p.firstChild, p);
      }
      parent.removeChild(p);
    }
  });

  // Replace <div> with <p>
  doc.querySelectorAll("div").forEach((div) => {
    const p = document.createElement("p");
    p.innerHTML = div.innerHTML;
    div.replaceWith(p);
  });

  // Clean empty <p>
  doc.querySelectorAll("p").forEach((p) => {
    if (!p.textContent?.trim() && !p.querySelector("img, br")) {
      p.remove();
    }
  });

  // Optional: Wrap &lt;email&gt; in a span for styling
  doc.querySelectorAll("p").forEach((p) => {
    p.innerHTML = p.innerHTML.replace(
      /&lt;([^>\s]+@[^>\s]+)&gt;/g,
      `<span style="color: gray; font-style: italic;">&lt;$1&gt;</span>`,
    );
  });

  console.log(doc.body);

  return doc.body.innerHTML;
}

export function extractBodyContent(htmlString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  return cleanHtmlForTiptap(doc.body.innerHTML);
}
