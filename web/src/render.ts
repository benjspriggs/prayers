export const render = {
  createElement: function(component: string, props: any, ...children: any[]) {
    const fragment = document.createDocumentFragment();

    const componentElement = document.createElement(component);

    Object.values(props).forEach(([key, value]) => {
      componentElement.setAttribute(key, value);
    });

    Array.from(children).forEach(child => {
      if (typeof child === "string") {
        const tn = document.createTextNode(child);
        componentElement.appendChild(tn);
      } else if (Array.isArray(child)) {
        Array.from(child).forEach(subChild => {
          componentElement.appendChild(subChild);
        });
      } else {
        componentElement.appendChild(child);
      }
    });

    fragment.appendChild(componentElement);

    return fragment;
  }
};
