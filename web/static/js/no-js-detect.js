/**
 * Detects JS when the page loads.
 */
(function() {
  window.addEventListener("load", function() {
    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js");
  });
})();
