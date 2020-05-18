import { html } from "common-tags";

export interface MockHtmlOptions {
  /**
   * Indicates whether an enclosing body-tag is wrapped around the html-content or not (useful if the html-content is a frameset)
   */
  autoBody: boolean;

  /**
   * Additional content which has to be placed in document HEAD (style etc.)
   */
  additionalHeadContent: string;
}

export function mockHtml(code: string, options?: Partial<MockHtmlOptions>) {
  const { autoBody, additionalHeadContent }: MockHtmlOptions = {
    ...{
      autoBody: true,
      additionalHeadContent: "",
    },
    ...options,
  };

  const bodyCode = autoBody ? `<body>${code}</body>` : code;

  return `data:text/html;base64, ${Buffer.from(
    html`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
          />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <title>Document</title>
          ${additionalHeadContent}
        </head>
        ${bodyCode}
      </html>
    `
  ).toString("base64")}`;
}
