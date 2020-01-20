customElements.define(
  "category-link",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["data-category-id"];
    }

    constructor() {
      super();

      const template = document.getElementById("category-link-template")
        .content;
      const shadowRoot = this.attachShadow({ mode: "open" }).appendChild(
        template.cloneNode(true)
      );
    }

    get link() {
      return this.shadowRoot.querySelector("#link");
    }

    get categoryId() {
      const idAttribute = this.attributes.getNamedItem("data-category-id");
      return idAttribute === null ? null : idAttribute.value;
    }

    attributeChangedCallback() {
      this.link.setAttribute("href", `/category?id=${this.categoryId}`);
    }
  }
);
