import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { ContentWidthDiv } from "../../Styles/ContentWidthHelpers";

export const footerHeightPx = 40;

const FooterContainer = styled.footer(
  ({ theme }) => css`
    margin-bottom: 40px;
    grid-area: footer;
    width: 100%;
    height: ${footerHeightPx}px;
    background: ${theme.marchGrey};
    color: ${theme.augustGrey};
    display: block;
  `
);

const FooterContent = styled(ContentWidthDiv)`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 16px;
  height: 100%;
`;

export function Footer() {
  const { pageContentIsWide } = useContext(AppContext);

  return (
    <FooterContainer>
      <FooterContent pageContentIsWide={pageContentIsWide} role="contentinfo">
        © {new Date().getFullYear()} solo.io, Inc. All Rights Reserved.
      </FooterContent>
    </FooterContainer>
  );
}
