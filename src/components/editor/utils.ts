// Custom serializer function to serialize Slate content to HTML
export let styling = (child: any) => {
    let text = child.text;
    // look for styling - bold, italic, underline, strikethrough, code,
    if (child?.underline) text = `<u>${text}</u>`;
    if (child?.italic) text = `<em>${text}</em>`;
    if (child?.strikethrough) text = `<s>${text}</s>`;
    if (child?.bold) text = `<strong>${text}</strong>`;
    if (child?.code) text = `<span><code style="display: inline; background: lightgrey; padding: 2px;">${text}</code></span>`;
  
    return text;
  };
  
export let formatText = (children: any) => {
    let text = "";
  
    for (let i = 0; i < children.length; i++) {
      let curr = children[i];
  
      let currText = styling(curr);
  
      // look for anchor tags
      if (curr.type === "a") currText = `<a href=${curr.url} target="_blank">${formatText(curr.children)}</a>`
  
      let { subscript, superscript, color, backgroundColor } = curr;
      if (superscript) currText = `<sup>${currText}</sup>`;
      if (subscript) currText = `<sub>${currText}</sub>`;
  
      if (color || backgroundColor) {
        currText = `<p style="display: inline;${color ? "color:" + color + ";" : ""}${backgroundColor ? "background:" + backgroundColor + ";" : ""
          }">${currText}</p>`;
      }
  
      text += currText;
      // console.log(curr, curr.type, currText);
      // console.log("\n")
    }
    // console.log(text);
    return text;
  };
export const serializeToHtml = (nodes: any) => {
    let html = "";
    let list = "";
  
    // loop through the nodes to check type
    for (let i = 0; i < nodes.length; i++) {
  
      let curr = nodes[i];
      let text = formatText(curr.children);
      // let styles = `styles="${getInlineStyles(curr)}"`;
  
      // if it is a p tag and no listStyleType then return a p
      if (curr.type === "p" && !curr.listStyleType && text) html += `<p>${text}</p>`;
      if (curr.type !== "p" && !curr.listStyleType) {
        if (curr.type === "hr") html += "</hr>";
        else if (curr.type !== "img" && text) html += `<${curr.type}>${text}</${curr.type}>`;
      }
  
      if (curr.type === "p" && curr.listStyleType && text) {
  
        list += `<li>${text}</li>`;
  
        // check the type of list
        let tag = curr.listStyleType === "decimal" ? "ol" : "ul";
        let previousTag = nodes[i - 1]?.listStyleType;
        let nextTag = nodes[i + 1]?.listStyleType;
  
        if (!previousTag && previousTag !== tag) html += `<${tag}>`;
        html += `<li>${text}</li>`;
        if (!nextTag && nextTag !== tag) { html += `</${tag}>`; list = '' };
      }
  
      if (curr.type === "img") {
        console.log(curr, "image");
        html += `<img src='${curr.url}' style='width: ${curr.width || 400}; object-fit: "contain";'/>`
  
      }
  
    }
    return html;
  };