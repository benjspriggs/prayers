customElements.define(
  "loading-indicator",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["active"];
    }

    constructor() {
      super();

      const template = document.getElementById("loading-template").content;
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.cloneNode(true));

      this.indicator.setAttribute("active", this.active);
    }

    get indicator() {
      return this.shadowRoot.querySelector("progress");
    }

    get active() {
      return this.attributes.getNamedItem("active");
    }

    get isLoading() {
      return this.active !== null;
    }

    attributeChangedCallback() {
      this.indicator.setAttribute("hidden", !this.isLoading);
    }
  }
);
