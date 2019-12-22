function doesElementImplementNode(element: any): element is Node {
  return typeof element === "object" && "nodeName" in element;
}

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
        if (key === "className") {
          const classes = value.split(" ").filter(c => !!c);
          componentElement.classList.add(...classes);
        } else {
          componentElement.setAttribute(key, value);
        }
      });
    }

    Array.from(children)
      .map(child => {
        if (typeof child === "string") {
          return document.createTextNode(child);
        } else if (Array.isArray(child)) {
          const nonNodeChildren = child.filter(
            el => !doesElementImplementNode(el)
          );
          const nodeChildren = child.filter(doesElementImplementNode);
          return nodeChildren.concat(
            nonNodeChildren.map(text => document.createTextNode(text))
          );
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
      .filter(child => !!child)
      .forEach(child => {
        componentElement.appendChild(child);
      });

    fragment.appendChild(componentElement);

    return fragment;
  }
};
