export const render = {
  createElement: function(component: string, props: any, ...children: any[]) {
    const fragment = document.createDocumentFragment();

    const componentElement = document.createElement(component);

    Object.values(props).forEach(([key, value]) => {
      componentElement.setAttribute(key, value);
    });

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
          acc.append(c);
        } else {
          acc.push(c);
        }

        return acc;
      }, [])
      .forEach(child => {
        componentElement.appendChild(child);
      });

    fragment.appendChild(componentElement);

    return fragment;
  }
};
