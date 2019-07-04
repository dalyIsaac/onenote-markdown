/* eslint-disable @typescript-eslint/no-namespace */

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "html-editor": {};
    }
  }
}

export class HtmlEditorComponent extends HTMLElement {
  public constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const parent = document.createElement("div");

    const notice = document.createElement("p");
    notice.textContent = "Hello HTML Web Component";

    parent.appendChild(notice);
    shadow.appendChild(parent);
  }
}

customElements.define("html-editor", HtmlEditorComponent);
