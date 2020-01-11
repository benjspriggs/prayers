import "jest";

import { render } from "./render";

describe("createElement", () => {
  const { createElement } = render;

  it("creates elements", () => {
    const h1 = document.createElement("h1");
    expect(createElement("h1", {})).toEqual(h1);
  });

  it("sets props", () => {
    const h1 = document.createElement("h1");
    h1.setAttribute("data-prop", "2");

    expect(
      createElement("h1", {
        "data-prop": "2"
      })
    ).toEqual(h1);
  });

  it("sets classes from `className`", () => {});

  describe("children", () => {
    it.todo("handles arrays");
    it.todo("handles null");
    it.todo("handles undefined");
    it.todo("handles promises");
    it.todo("handles raw strings");
  });
});
