import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const contentWidth = {
  standard: "1385px",
  wide: "1920px",
};

const makeContentWidthCSS = (pageContentIsWide: boolean) => css`
  width: calc(100vw - 16px);
  max-width: ${pageContentIsWide ? contentWidth.wide : contentWidth.standard};
  padding: 0 30px;
  margin: 0 auto;
`;

export const ContentWidthDiv = styled.div<{ pageContentIsWide: boolean }>(
  ({ pageContentIsWide }) => makeContentWidthCSS(pageContentIsWide)
);

export const ContentWidthMain = styled.main<{ pageContentIsWide: boolean }>(
  ({ pageContentIsWide }) => makeContentWidthCSS(pageContentIsWide)
);

export const ContentWidthNav = styled.nav<{ pageContentIsWide: boolean }>(
  ({ pageContentIsWide }) => makeContentWidthCSS(pageContentIsWide)
);
