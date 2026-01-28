declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  const src: string;
  export default src;
}

declare module "*.svg?react" {
  import React = require("react");
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

/**
 * This is a global variable that /projects/server/app.js inserts
 * into the UI build when serving it. It is used so that the
 * environment variables can be dynamically updated after the
 * Docker image is built.
 */
declare const insertedEnvironmentVariables:
  | undefined
  | {
      [key: string]: string;
    };
