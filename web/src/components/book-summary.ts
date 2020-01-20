import { WebComponent } from "./web-component";

customElements.define(
  "book-summary",
  class extends WebComponent {
    constructor() {
      super({
        name: "book-template"
      });
    }

    get bookId() {
      const idAttribute = this.attributes.getNamedItem("data-book-id");
      return idAttribute === null ? null : idAttribute.value;
    }
  }
);
