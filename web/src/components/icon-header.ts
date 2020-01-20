(function() {
  class IconHeaderComponent extends HTMLElement {
    private _showSearch: () => void;
    private _hideSearch: () => void;
    private mutationObserver: MutationObserver;

    constructor() {
      super();

      const iconHeaderTemplate = document.getElementById(
        "icon-header-template"
      );
      this.attachShadow({ mode: "open" });
      this.shadowRoot!.appendChild(iconHeaderTemplate!.cloneNode(true));

      this._showSearch = this.showSearch.bind(this);
      this._hideSearch = this.hideSearch.bind(this);

      this.searchButton.addEventListener("click", this._showSearch);
      this.searchButton.addEventListener("focus", this._showSearch);
      this.searchBox.addEventListener("blur", this._hideSearch);

      this.mutationObserver = new MutationObserver(
        (mutationsList, observer) => {
          const headerTargets = document.querySelectorAll("[data-header]");

          const backLinkTarget = document.querySelector("[data-back-link]");

          let targetText = "";

          headerTargets.forEach(target => {
            targetText += target.getAttribute("data-header");
          });

          this.selfLink.textContent = targetText;

          if (backLinkTarget) {
            this.backButton.href = backLinkTarget.getAttribute(
              "data-back-link"
            )!;
          }

          this.selfLink.removeAttribute("hidden");
        }
      );
    }

    get searchButton() {
      return this.shadowRoot!.querySelector("#search-button")!;
    }

    get searchForm(): HTMLFormElement {
      return this.shadowRoot!.querySelector("#search-form")! as HTMLFormElement;
    }

    get searchBox(): HTMLInputElement {
      return this.searchForm.querySelector(
        'input[name="q"'
      )! as HTMLInputElement;
    }

    get settingsButton() {
      return this.shadowRoot!.querySelector("#settings-button")!;
    }

    get backButton(): HTMLAnchorElement {
      return this.shadowRoot!.querySelector(
        "#back-button"
      )! as HTMLAnchorElement;
    }

    get selfLink(): HTMLAnchorElement {
      return this.shadowRoot!.querySelector("#self-link")! as HTMLAnchorElement;
    }

    connectedCallback() {
      const hostAttributes = this.attributes;

      if (hostAttributes.getNamedItem("search") !== null) {
        this.enableSearch();
      }

      if (hostAttributes.getNamedItem("settings") !== null) {
        this.enableSettings();
      }

      if (hostAttributes.getNamedItem("back") !== null) {
        this.enableBackNavigation();

        const href = hostAttributes.getNamedItem("back")!.value;

        this.backButton.href = href || "/";
      } else {
        this.backButton.href = "/";
      }

      window.addEventListener("DOMContentLoaded", () => {
        this.mutationObserver.observe(document.querySelector("main")!, {
          attributes: false,
          childList: true,
          subtree: true
        });
      });
    }

    disconnectedCallback() {
      this.mutationObserver.disconnect();
    }

    enableSearch() {
      this.searchButton.removeAttribute("hidden");
      this.searchForm.removeAttribute("hidden");
    }

    enableSettings() {
      this.settingsButton.removeAttribute("hidden");
    }

    enableBackNavigation() {
      this.backButton.removeAttribute("hidden");
    }

    disableSearch() {
      this.searchButton.setAttribute("hidden", "");
      this.searchForm.setAttribute("hidden", "");
    }

    disableBackNavigation() {
      this.backButton.setAttribute("hidden", "");
    }

    showSearch() {
      this.searchForm.style.display = "initial";
      this.searchBox.focus();
      window.dispatchEvent(new Event("search:open"));
    }

    hideSearch() {
      this.searchForm.style.display = "none";
      window.dispatchEvent(new Event("search:close"));
    }
  }

  customElements.define("icon-header", IconHeaderComponent);
})();
