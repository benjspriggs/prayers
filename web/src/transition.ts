import "/js/swup.js";

function addSwupListener(eventType: SwupEvent, listener: (e: Event) => void) {
  const documentEventType = `swup:${eventType}`;
  console.debug("add event type", documentEventType);
  document.addEventListener(`swup:${eventType}`, listener);
}

const OPT_IN_ATTRIBUTE = "data-refresh-on-reload";

function allowRefresh(script: HTMLScriptElement): boolean {
  const refreshOnReload = script.getAttribute(OPT_IN_ATTRIBUTE);

  return refreshOnReload !== null;
}

/**
 * Reloads a script.
 */
async function refreshScript(script: HTMLScriptElement) {
  if (!allowRefresh(script)) {
    return;
  }

  console.log("refresh (noop)", script);
  return;

  const refreshedScript = document.createElement("script");

  Array.from(script.attributes).forEach(attribute => {
    refreshedScript.setAttribute(attribute.name, attribute.value);
  });

  refreshedScript.textContent = script.textContent;
  refreshedScript.setAttribute("async", "false");

  script.replaceWith(refreshedScript);
  console.log(refreshedScript);
}

const ORIGIN_SCRIPT_KEY = "data-script-origin";

function registerScript(l: Location, s: HTMLScriptElement) {
  if (!allowRefresh(s)) {
    return;
  }

  const dataSource = s.getAttribute(ORIGIN_SCRIPT_KEY);

  if (dataSource !== null) {
    // This script is already registered.
    return;
  }

  const locationString = l.toString();

  s.setAttribute(ORIGIN_SCRIPT_KEY, locationString);
  console.log("register", s);
}

function refreshScripts(l: Location) {
  const locationString = l.toString();
  const scriptsToRefresh = Array.from(document.scripts)
    .filter(allowRefresh)
    .filter(
      script => script.getAttribute(ORIGIN_SCRIPT_KEY) === locationString
    );

  console.log(scriptsToRefresh);

  scriptsToRefresh.forEach(refreshScript);
}

addSwupListener("pageView", e => {
  if (!e.target) {
    console.log("no target", e);
    return;
  }

  const html = e.target as HTMLDocument;

  Array.from(html.scripts).forEach(script => {
    registerScript(window.location, script);
  });
});

addSwupListener("contentReplaced", () => {
  refreshScripts(window.location);
});

const swup = new Swup({
  cache: false,
  debugMode: true
});
