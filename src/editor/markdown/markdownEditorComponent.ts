/* eslint-disable @typescript-eslint/no-namespace */

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "markdown-editor": {};
    }
  }
}

export class MarkdownEditorComponent extends HTMLElement {
  public constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const parent = document.createElement("div");

    const notice = document.createElement("p");
    notice.textContent = "Hello Markdown Web Component";

    parent.appendChild(notice);
    shadow.appendChild(parent);
  }
}

customElements.define("markdown-editor", MarkdownEditorComponent);
