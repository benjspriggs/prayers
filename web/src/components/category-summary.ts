customElements.define(
  "category-summary",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["data-category-id"];
    }

    constructor() {
      super();

      const template = document.getElementById("category-template").content;
      const shadowRoot = this.attachShadow({ mode: "open" }).appendChild(
        template.cloneNode(true)
      );
    }

    get categoryId() {
      const idAttribute = this.attributes.getNamedItem("data-category-id");
      return idAttribute === null ? null : idAttribute.value;
    }

    get link() {
      return this.shadowRoot.querySelector("category-link");
    }

    attributeChangedCallback() {
      this.link.setAttribute("data-category-id", this.categoryId);
    }
  }
);
