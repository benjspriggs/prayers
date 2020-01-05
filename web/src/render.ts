function doesElementImplementNode(element: any): element is Node {
  return typeof element === "object" && "nodeName" in element;
}

function append(parent: Node, children: Node | Node[]) {
  if (Array.isArray(children)) {
    children.forEach(child => {
      parent.appendChild(child);
    });
  } else {
    parent.appendChild(children);
  }
}

function renderChildElement(child: any): Node | Node[] {
  if (typeof child === "string") {
    return document.createTextNode(child);
  } else if (Array.isArray(child)) {
    const nonNodeChildren = child.filter(el => !doesElementImplementNode(el));
    const nodeChildren = child.filter(doesElementImplementNode);
    return nodeChildren.concat(
      nonNodeChildren.map(text => document.createTextNode(text))
    );
  } else if (
    typeof child === "object" &&
    "then" in child &&
    child.then instanceof Function
  ) {
    // we render a fragment for this child, which will be resolved with render()
    // on that child.
    const id = Math.random()
      .toString(36)
      .substr(2);
    const asyncPlaceholder = document.createComment(id);
    child.then((resolvedChild: Node | Node[]) => {
      const fragment = document.createDocumentFragment();
      append(fragment, resolvedChild);
      asyncPlaceholder.replaceWith(fragment);
    });
    return asyncPlaceholder;
  } else {
    return <Node>child;
  }
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
      .map(renderChildElement)
      .reduce<Node[]>((acc, c) => {
        if (Array.isArray(c)) {
          return acc.concat(c);
        } else {
          return acc.concat([c]);
        }
      }, [])
      .filter(child => child !== null && typeof child !== "undefined")
      .forEach(child => {
        componentElement.appendChild(child);
      });

    fragment.appendChild(componentElement);

    return fragment;
  }
};
