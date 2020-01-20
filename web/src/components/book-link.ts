import { WebComponent } from "./web-component";

customElements.define(
  "book-link",
  class extends WebComponent {
    static get observedAttributes() {
      return ["data-book-id"];
    }

    constructor() {
      super({
        name: "book-link-template"
      });
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
