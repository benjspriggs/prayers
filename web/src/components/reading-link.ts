customElements.define(
  "reading-link",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["data-reading-id"];
    }

    constructor() {
      super();

      const template = document.getElementById("reading-link-template").content;
      const shadowRoot = this.attachShadow({ mode: "open" }).appendChild(
        template.cloneNode(true)
      );
    }

    get link() {
      return this.shadowRoot.querySelector("#link");
    }

    get readingId() {
      const idAttribute = this.attributes.getNamedItem("data-reading-id");
      return idAttribute === null ? null : idAttribute.value;
    }

    attributeChangedCallback() {
      this.link.setAttribute("href", `/reading?id=${this.readingId}`);
    }
  }
);
