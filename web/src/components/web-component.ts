export interface IWebComponentOptions {
  name: string;
  mode?: ShadowRootMode;
}

export abstract class WebComponent extends HTMLElement {
  constructor(options: IWebComponentOptions) {
    super();

    const template = <HTMLTemplateElement>document.getElementById(options.name);

    if (!template) {
      throw new Error(`Template with name '${options.name}' is missing.`);
    }

    this.attachShadow({ mode: options.mode || "open" }).appendChild(
      template.content.cloneNode(true)
    );
  }
}
