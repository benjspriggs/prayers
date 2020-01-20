customElements.define(
  "author-summary",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["data-author-id"];
    }

    constructor() {
      super();

      const template = document.getElementById("author-template")!;
      this.attachShadow({ mode: "open" }).appendChild(template.cloneNode(true));
    }

    get authorId() {
      const idAttribute = this.attributes.getNamedItem("data-author-id");
      return idAttribute === null ? null : idAttribute.value;
    }

    get link() {
      return this.shadowRoot!.querySelector("author-link");
    }

    attributeChangedCallback() {
      if (this.authorId)
        this.link!.setAttribute("data-author-id", this.authorId);
    }
  }
);
