import { WebComponent } from "./web-component";

customElements.define(
  "category-link",
  class extends WebComponent {
    static get observedAttributes() {
      return ["data-category-id"];
    }

    constructor() {
      super({
        name: "category-link-template"
      });
    }

    get link() {
      return this.shadowRoot!.querySelector("#link");
    }

    get categoryId() {
      const idAttribute = this.attributes.getNamedItem("data-category-id");
      return idAttribute === null ? null : idAttribute.value;
    }

    attributeChangedCallback() {
      this.link!.setAttribute("href", `/category?id=${this.categoryId}`);
    }
  }
);
