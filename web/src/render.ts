function generateAsyncPlaceholderNode() {
  const id = Math.random()
    .toString(36)
    .substr(2);
  return document.createComment(id);
}

function doesElementImplementNode(element: any): element is Node {
  return typeof element === "object" && "nodeName" in element;
}

function appendChildOrChildren(parent: Node, children: Node | Node[]) {
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
    child !== null &&
    typeof child === "object" &&
    "then" in child &&
    child.then instanceof Function
  ) {
    const asyncPlaceholder = generateAsyncPlaceholderNode();
    child.then((resolvedChild: Node | Node[]) => {
      const fragment = document.createDocumentFragment();
      appendChildOrChildren(fragment, resolvedChild);
      asyncPlaceholder.replaceWith(fragment);
    });
    return asyncPlaceholder;
  } else {
    return <Node>child;
  }
}

function attach(what: Node, where: Node) {
  where.appendChild(what);
}

const render = {
  createElement: function createElement(
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

    const mappedChildren = Array.from(children)
      .map(renderChildElement)
      .reduce<Node[]>((acc, c) => {
        if (Array.isArray(c)) {
          return acc.concat(c);
        } else {
          return acc.concat([c]);
        }
      }, [])
      .filter(child => child !== null && typeof child !== "undefined");

    appendChildOrChildren(componentElement, mappedChildren);

    fragment.appendChild(componentElement);

    return fragment;
  }
};

export { attach, appendChildOrChildren, render };
