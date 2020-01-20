customElements.define(
  "loading-indicator",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["active"];
    }

    constructor() {
      super();

      const template = document.getElementById("loading-template")!;
      this.attachShadow({ mode: "open" });
      this.shadowRoot!.appendChild(template.cloneNode(true));

      if (this.active)
        this.indicator!.setAttribute("active", this.active.value);
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

    attributeChangedCallback() {
      if (this.indicator)
        this.indicator.setAttribute("hidden", String(!this.isLoading));
    }
  }
);
