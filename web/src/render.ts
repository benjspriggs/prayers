export const render = {
  createElement: function(
    component: string,
    props: { [key: string]: string } | null,
    ...children: any[]
  ) {
    const fragment = document.createDocumentFragment();

    const componentElement = document.createElement(component);

    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        componentElement.setAttribute(key, value);
      });
    }

    Array.from(children)
      .map(child => {
        if (typeof child === "string") {
          return document.createTextNode(child);
        } else {
          return child;
        }
      })
      .reduce((acc, c) => {
        if (Array.isArray(c)) {
          return acc.concat(c);
        } else {
          return acc.concat([c]);
        }
      }, [])
      .forEach(child => {
        componentElement.appendChild(child);
      });

    fragment.appendChild(componentElement);

    return fragment;
  }
};
