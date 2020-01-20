customElements.define(
  "book-summary",
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.getElementById("book-template")!;
      this.attachShadow({ mode: "open" }).appendChild(template.cloneNode(true));
    }

    get bookId() {
      const idAttribute = this.attributes.getNamedItem("data-book-id");
      return idAttribute === null ? null : idAttribute.value;
    }
  }
);
