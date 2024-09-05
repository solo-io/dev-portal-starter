import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { appliedOidcAuthCodeConfig } from "../user_variables.tmplr";
import AppContentRoutes from "./AppContentRoutes";
import { Header } from "./Structure/BasicAuthVariant/Header";
import OidcAuthCodeHeaderVariant from "./Structure/OidcAuthCodeHeaderVariant/OidcAuthCodeHeaderVariant";

export const StyledAppContainer = styled.div(
  ({ theme }) => css`
    position: relative;

    display: grid;
    grid-template-rows: 90px 1fr;
    grid-template-areas:
      "header"
      "contentcontainer";

    min-height: 100vh;
    background: ${theme.background};
    color: ${theme.defaultText};
  `
);

function AppContent() {
  const appCtx = useContext(AppContext);
  const { isDarkMode } = appCtx;

  /** Explanation of the data/class wrappings below:
   *    darkMode is from context. See the wrapping in App.tsx
   */
  return (
    <StyledAppContainer data-theme={isDarkMode ? "dark" : "light"}>
      {!!appliedOidcAuthCodeConfig ? <OidcAuthCodeHeaderVariant /> : <Header />}
      <AppContentRoutes />
    </StyledAppContainer>
  );
}

export default AppContent;
