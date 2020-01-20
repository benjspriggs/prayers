import { WebComponent } from "./web-component";

customElements.define(
  "reading-link",
  class extends WebComponent {
    static get observedAttributes() {
      return ["data-reading-id"];
    }

    constructor() {
      super({
        name: "reading-link-template"
      });
    }

    get link() {
      return this.shadowRoot!.querySelector("#link");
    }

    get readingId() {
      const idAttribute = this.attributes.getNamedItem("data-reading-id");
      return idAttribute === null ? null : idAttribute.value;
    }

    attributeChangedCallback() {
      this.link!.setAttribute("href", `/reading?id=${this.readingId}`);
    }
  }
);
