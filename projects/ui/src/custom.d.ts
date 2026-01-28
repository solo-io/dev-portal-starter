declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  const src: string;
  export default src;
}

// This is the type needed for vite-plugin-svgr
// https://www.npmjs.com/package/vite-plugin-svgr#usage
declare module "*.svg?react" {
  import * as React from "react";
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
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
