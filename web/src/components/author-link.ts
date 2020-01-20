customElements.define(
  "author-link",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["data-author-id"];
    }

    constructor() {
      super();

      const template = document.getElementById("author-link-template").content;
      const shadowRoot = this.attachShadow({ mode: "open" }).appendChild(
        template.cloneNode(true)
      );
    }

    get link() {
      return this.shadowRoot.querySelector("#link");
    }

    get authorId() {
      const idAttribute = this.attributes.getNamedItem("data-author-id");
      return idAttribute === null ? null : idAttribute.value;
    }

    attributeChangedCallback() {
      this.link.setAttribute("href", `/author?id=${this.authorId}`);
    }
  }
);
