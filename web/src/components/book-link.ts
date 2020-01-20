customElements.define(
  "book-link",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["data-book-id"];
    }

    constructor() {
      super();

      const template = document.getElementById("book-link-template")!;
      this.attachShadow({ mode: "open" }).appendChild(template.cloneNode(true));
    }

    get link() {
      return this.shadowRoot!.querySelector("#link");
    }

    get bookId() {
      const idAttribute = this.attributes.getNamedItem("data-book-id");
      return idAttribute === null ? null : idAttribute.value;
    }

    attributeChangedCallback() {
      this.link!.setAttribute("href", `/book?id=${this.bookId}`);
    }
  }
);
