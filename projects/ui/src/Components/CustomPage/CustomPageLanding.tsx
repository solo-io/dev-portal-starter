import { Code } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { customPages } from "../../user_variables.tmplr";
import { getCustomPagePath } from "../../Utility/utility";
import { EmptyData } from "../Common/EmptyData";
import { Loading } from "../Common/Loading";

import styled from "@emotion/styled";
import CustomHtmlPage from "./Content/CustomHtmlPage";
import CustomMarkdownPage from "./Content/CustomMarkdownPage";

type CustomPageType = "md" | "html" | "loading" | "unsupported";

const StyledCustomPageContainer = styled.div`
  margin: 60px;
`;

//
// region Component
//
const CustomPageLanding = () => {
  const location = useLocation();

  // Find our custom page object.
  const customPage = useMemo(() => {
    return customPages.find(
      (page) => getCustomPagePath(page) === location.pathname
    );
  }, [location.pathname]);

  // Get the page type.
  const customPageType = useMemo<CustomPageType>(() => {
    if (!customPage) {
      return "loading";
    }
    const lowercasePath = customPage.path.toLowerCase();
    if (lowercasePath.endsWith(".md")) {
      return "md";
    }
    if (lowercasePath.endsWith(".html")) {
      return "html";
    }
    return "unsupported";
  }, [customPage?.path]);

  // Fetch custom page content
  const [customPageContent, setCustomPageContent] = useState<string>();
  useEffect(() => {
    if (!customPage) {
      return;
    }
    (async () => {
      const newPageContent = await (await fetch(customPage.path)).text();
      setCustomPageContent(newPageContent);
    })();
  }, [customPage, setCustomPageContent]);

  //
  // region Render
  //
  if (!customPage) {
    return (
      <StyledCustomPageContainer>
        <EmptyData title="Unable to find custom page." />;
      </StyledCustomPageContainer>
    );
  }
  if (customPageType === "loading") {
    return (
      <StyledCustomPageContainer>
        <Loading message="Getting custom page content..." />
      </StyledCustomPageContainer>
    );
  }
  if (customPageType === "unsupported") {
    return (
      <StyledCustomPageContainer>
        <EmptyData title="Unsupported file type.">
          Markdown and HTML custom pages are supported.
          <br />
          To view this page, update the <Code>path</Code> for this custom page
          so that it ends in <Code>.md</Code> or <Code>.html</Code>.
        </EmptyData>
      </StyledCustomPageContainer>
    );
  }
  if (!customPageContent) {
    return (
      <StyledCustomPageContainer>
        <EmptyData title="Custom page not found.">
          To view this page, make sure that your custom page is publicly
          accessible at <Code>{customPage.path}</Code>.
        </EmptyData>
      </StyledCustomPageContainer>
    );
  }
  if (customPageType === "md") {
    return (
      <CustomMarkdownPage
        customPage={customPage}
        customPageContent={customPageContent}
      />
    );
  }
  return <CustomHtmlPage customPageUrl={customPage.path} />;
};

export default CustomPageLanding;
