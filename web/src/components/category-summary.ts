import { WebComponent } from "./web-component";

customElements.define(
  "category-summary",
  class extends WebComponent {
    static get observedAttributes() {
      return ["data-category-id"];
    }

    constructor() {
      super({
        name: "category-template"
      });
    }

    get categoryId() {
      const idAttribute = this.attributes.getNamedItem("data-category-id");
      return idAttribute === null ? null : idAttribute.value;
    }

    get link() {
      return this.shadowRoot!.querySelector("category-link");
    }

    attributeChangedCallback() {
      if (this.categoryId)
        this.link!.setAttribute("data-category-id", this.categoryId);
    }
  }
);
