(function() {
  class IconHeaderComponent extends HTMLElement {
    constructor() {
      super();

      const iconHeaderTemplate = document.getElementById("icon-header-template")
        .content;
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(iconHeaderTemplate.cloneNode(true));

      this._showSearch = this.showSearch.bind(this);
      this._hideSearch = this.hideSearch.bind(this);

      this.searchButton.addEventListener("click", this._showSearch);
      this.searchButton.addEventListener("focus", this._showSearch);
      this.searchForm
        .querySelector('input[name="q"]')
        .addEventListener("blur", this._hideSearch);

      this.mutationObserver = new MutationObserver(
        (mutationsList, observer) => {
          const headerTargets = document.querySelectorAll("[data-header]");

          const backLinkTarget = document.querySelector("[data-back-link]");

          headerTargets.forEach(target => {
            this.selfLink.textContent += target.getAttribute("data-header");
          });

          if (backLinkTarget) {
            this.backButton.href = backLinkTarget.getAttribute(
              "data-back-link"
            );
          }

          this.selfLink.removeAttribute("hidden");
        }
      );
    }

    get searchButton() {
      return this.shadowRoot.querySelector("#search-button");
    }

    get searchForm() {
      return this.shadowRoot.querySelector("#search-form");
    }

    get settingsButton() {
      return this.shadowRoot.querySelector("#settings-button");
    }

    get backButton() {
      return this.shadowRoot.querySelector("#back-button");
    }

    get selfLink() {
      return this.shadowRoot.querySelector("#self-link");
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

        const href = hostAttributes.getNamedItem("back").value;

        this.backButton.href = href || "/";
      } else {
        this.backButton.href = "/";
      }

      window.addEventListener("DOMContentLoaded", () => {
        this.mutationObserver.observe(document.querySelector("main"), {
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
      this.searchForm.querySelector('input[name="q"]').focus();
      window.dispatchEvent(new Event("search:open"));
    }

    hideSearch() {
      this.searchForm.style.display = "none";
      window.dispatchEvent(new Event("search:close"));
    }
  }

  customElements.define("icon-header", IconHeaderComponent);
})();
