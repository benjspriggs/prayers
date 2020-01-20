customElements.define(
  "book-link",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["data-book-id"];
    }

    constructor() {
      super();

      const template = <HTMLTemplateElement>(
        document.getElementById("book-link-template")!
      );
      this.attachShadow({ mode: "open" }).appendChild(
        template.content.cloneNode(true)
      );
    }

    get link() {
      return this.shadowRoot!.querySelector("#link");
    }

    get bookId() {
      const idAttribute = this.attributes.getNamedItem("data-book-id");
      return idAttribute === null ? null : idAttribute.value;
    }

    attributeChangedCallback() {
      if (this.link) this.link.setAttribute("href", `/book?id=${this.bookId}`);
    }
  }
);
