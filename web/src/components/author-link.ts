import { WebComponent } from "./web-component";

customElements.define(
  "author-link",
  class extends WebComponent {
    static get observedAttributes() {
      return ["data-author-id"];
    }

    constructor() {
      super({
        name: "author-link-template"
      });
    }

    get link() {
      return this.shadowRoot!.querySelector("#link");
    }

    get authorId() {
      const idAttribute = this.attributes.getNamedItem("data-author-id");
      return idAttribute === null ? null : idAttribute.value;
    }

    attributeChangedCallback() {
      this.link!.setAttribute("href", `/author?id=${this.authorId}`);
    }
  }
);
