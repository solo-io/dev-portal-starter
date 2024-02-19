import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { ContentWidthDiv } from "../../Styles/ContentWidthHelpers";

const FooterContainer = styled.footer(
  ({ theme }) => css`
    padding: 30px 30px 25px;
    margin-bottom: 40px;
    grid-area: footer;
    width: 100%;
    height: 40px;
    background: ${theme.marchGrey};
    color: ${theme.augustGrey};

    .banner {
      max-width: 51%;
    }
    .bannerHeading {
      max-width: 48%;
    }
  `
);

const FooterContent = styled(ContentWidthDiv)`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 16px;

  height: 100%;
`;

/**
 * MAIN COMPONENT
 **/
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
