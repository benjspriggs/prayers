import "jest";

import { render } from "./render";

function flush() {
  return new Promise(resolve => {
    setTimeout(resolve);
  });
}

describe("createElement", () => {
  const { createElement } = render;
  jest.useFakeTimers();

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

  it("sets classes from `className`", () => {
    const h1 = document.createElement("h1");
    h1.classList.add("foo");
    h1.classList.add("bar");
    h1.classList.add("baz");

    expect(
      createElement("h1", {
        className: "foo bar baz"
      })
    ).toEqual(h1);
  });

  describe("children", () => {
    it("handles null", () => {
      const h1 = document.createElement("h1");

      expect(createElement("h1", {}, null)).toEqual(h1);
    });

    it("handles undefined", () => {
      const h1 = document.createElement("h1");

      expect(createElement("h1", {}, undefined)).toEqual(h1);
    });

    it("handles raw strings", () => {
      const value = "blah";
      const h1 = document.createElement("h1");
      const textNode = document.createTextNode(value);

      h1.appendChild(textNode);

      expect(createElement("h1", {}, value)).toEqual(h1);
    });

    it("handles numbers", () => {
      const value = 42;
      const h1 = document.createElement("h1");
      const textNode = document.createTextNode(String(value));

      h1.appendChild(textNode);

      expect(createElement("h1", {}, value)).toEqual(h1);
    });

    it("handles booleans", () => {
      const value = false;
      const h1 = document.createElement("h1");
      const textNode = document.createTextNode(String(value));

      h1.appendChild(textNode);

      expect(createElement("h1", {}, value)).toEqual(h1);
    });

    it("handles objects", () => {
      const value = { a: 2, b: 3 };
      const h1 = document.createElement("h1");
      const textNode = document.createTextNode(String(value));

      h1.appendChild(textNode);

      expect(createElement("h1", {}, value)).toEqual(h1);
    });

    it("handles arrays of elements", () => {
      const h1 = document.createElement("h1");

      const p1 = document.createElement("p");
      p1.setAttribute("id", "1");
      const p2 = document.createElement("p");
      p2.setAttribute("id", "2");

      h1.appendChild(p1);
      h1.appendChild(p2);

      expect(
        createElement("h1", {}, [
          createElement("p", { id: "1" }),
          createElement("p", { id: "2" })
        ])
      ).toEqual(h1);

      expect(
        createElement(
          "h1",
          {},
          createElement("p", { id: "1" }),
          createElement("p", { id: "2" })
        )
      ).toEqual(h1);
    });

    it("handles promises", async () => {
      const asyncData = Promise.resolve("a string");
      const h1 = document.createElement("h1");
      const textNode = document.createTextNode("a string");

      h1.appendChild(textNode);

      const rendered = createElement("h1", {}, asyncData);

      await flush();

      expect(rendered).toEqual(h1);
    });
  });
});
