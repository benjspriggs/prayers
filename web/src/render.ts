export const render = {
  createElement: function(component: string, props: any, ...children: any[]) {
    const fragment = document.createDocumentFragment();

    const c = document.createElement(component);

    for (var p in props) {
      c.setAttribute(p, props[p]);
    }

    Array.from(children).forEach(child => {
      if (typeof child === "string") {
        const tn = document.createTextNode(child);
        c.appendChild(tn);
      } else {
        c.appendChild(child);
      }
    });

    fragment.appendChild(c);

    return fragment;
  }
};
