import { WebComponent } from "./web-component";

customElements.define(
  "author-summary",
  class extends WebComponent {
    static get observedAttributes() {
      return ["data-author-id"];
    }

    constructor() {
      super({
        name: "author-template"
      });
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
