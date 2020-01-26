declare class Swup {
  constructor(options?: { cache?: boolean; debugMode?: boolean });

  on(eventType: SwupEvent, callback: (e: Event) => void);
}

declare type SwupEvent =
  | "animationInDone" // triggers when transition of all animated elements is done (after content is replaced)
  | "animationInStart" // triggers when animation IN starts (class is-animating is removed from html tag)
  | "animationOutDone" // triggers when transition of all animated elements is done (after click of link and before content is replaced)
  | "animationOutStart" // triggers when animation OUT starts (class is-animating is added to html tag)
  | "animationSkipped" // triggers when transition is skipped (on back/forward buttons)
  | "clickLink" // triggers when link is clicked
  | "contentReplaced" // triggers right after the content of page is replaced
  | "disabled" // triggers on destroy()
  | "enabled" // triggers when swup instance is created or re-enabled after call of destroy()
  | "hoverLink" // triggers when link is hovered
  | "openPageInNewTab" // triggers when page is opened to new tab (link clicked when control key is pressed)
  | "pageLoaded" // triggers when loading of some page is done
  | "pagePreloaded" // triggers when the preload of some page is done (differs from pageLoaded only by the source of event - hover/click)
  | "pageRetrievedFromCache" // triggers when page is retrieved from cache and no request is necessary
  | "pageView" // similar to contentReplaced, except it is once triggered on load
  | "popState" // triggers on popstate events (back/forward button)
  | "samePage" // triggers when link leading to the same page is clicked
  | "samePageWithHash" // triggers when link leading to the same page with #someElement in the href attribute is clicked
  | "transitionStart" // triggers when transition start (loadPage method is called)
  | "transitionEnd" // triggers when transition ends (content is replaced and all animations are done
  | "willReplaceContent"; // triggers right before the content of page is replaced
