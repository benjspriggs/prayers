function generateAsyncPlaceholderNode() {
  const id = Math.random()
    .toString(36)
    .substr(2);
  return document.createComment(id);
}

function doesElementImplementNode(element: any): element is Node {
  return (
    typeof element === "object" && element !== null && "nodeName" in element
  );
}

function appendChildOrChildren(parent: Node, children: Node | Node[]) {
  if (Array.isArray(children)) {
    children.forEach(child => {
      appendChildOrChildren(parent, child);
    });
  } else {
    parent.appendChild(children);
  }
}

function renderChildElement(child: any): Node | Node[] {
  if (typeof child === "string") {
    return document.createTextNode(child);
  } else if (doesElementImplementNode(child)) {
    return child;
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
    child.then((resolvedChild: any) => {
      const fragment = document.createDocumentFragment();
      const renderedChild = renderChildElement(resolvedChild);
      appendChildOrChildren(fragment, renderedChild);
      asyncPlaceholder.replaceWith(fragment);
    });
    return asyncPlaceholder;
  } else {
    return document.createTextNode(String(child));
  }
}

function attach(what: Node, where: Node) {
  where.appendChild(what);
}

const render = {
  Fragment: "RenderFragment",
  createElement: function createElement(
    component: string,
    props: { [key: string]: any } | null,
    ...children: any[]
  ) {
    const componentElement =
      component === render.Fragment
        ? document.createDocumentFragment()
        : document.createElement(component);

    if (componentElement instanceof HTMLElement && props) {
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

    return componentElement;
  }
};

export { attach, appendChildOrChildren, render };
