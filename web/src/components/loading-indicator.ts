import { WebComponent } from "./web-component";

customElements.define(
  "loading-indicator",
  class extends WebComponent {
    static get observedAttributes() {
      return ["active"];
    }

    constructor() {
      super({
        name: "loading-template"
      });
    }

    get indicator() {
      return this.shadowRoot!.querySelector("progress");
    }

    get active() {
      return this.attributes.getNamedItem("active");
    }

    get isLoading() {
      return this.active !== null;
    }

    connectedCallback() {
      if (this.active)
        this.indicator!.setAttribute("active", this.active.value);
    }

    attributeChangedCallback() {
      if (this.indicator)
        this.indicator.setAttribute("hidden", String(!this.isLoading));
    }
  }
);
