import * as rxjs from "@npm/rxjs";
import * as operators from "@npm/rxjs/operators";

declare global {
  interface Window {
    rxjs: typeof rxjs & {
      operators: typeof operators;
    };
  }
}

export { rxjs };
