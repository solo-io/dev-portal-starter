import { css } from "@emotion/react";
import { mantineGlobalStyles } from "./mantine-overrides.style";
import { siteGlobalStyles } from "./site.style";

// prettier-ignore
import "./style-reset.css";
// prettier-ignore
import "./fontFace.css";
// prettier-ignore
// import "./graphiql.min.css";
// prettier-ignore
import "./highlight.js.min.css";

export const globalStyles = css`
  ${mantineGlobalStyles}
  ${siteGlobalStyles}
`;
