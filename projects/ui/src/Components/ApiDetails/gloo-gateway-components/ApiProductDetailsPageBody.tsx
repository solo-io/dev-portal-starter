import { Tabs } from "@mantine/core";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ApiProductDetails,
  ApiVersion,
  ApiVersionSchema,
} from "../../../Apis/api-types";
import { ContentWidthDiv } from "../../../Styles/ContentWidthHelpers";
import DocsTabContent from "./DocsTab/DocsTabContent";
import SchemaTabContent from "./SchemaTab/SchemaTabContent";

export const API_DETAILS_URL_SEARCH_PARAM_TAB_KEY = "tab";
export const apiProductDetailsTabValues = {
  SPEC: "spec",
  DOCS: "docs",
};
const defaultTabValue = apiProductDetailsTabValues.SPEC;

export function ApiProductDetailsPageBody({
  apiProduct,
  selectedApiVersion,
  apiProductVersions,
  apiVersionSpec,
}: {
  apiProduct: ApiProductDetails;
  selectedApiVersion: ApiVersion | null;
  apiProductVersions: ApiVersion[];
  apiVersionSpec: ApiVersionSchema | undefined;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(
    new URLSearchParams(location.search).get(
      API_DETAILS_URL_SEARCH_PARAM_TAB_KEY
    ) ?? defaultTabValue
  );
  // Update the URL when the selected tab changes.
  useEffect(() => {
    const newSearchParams = new URLSearchParams(location.search);
    if (!!tab) {
      newSearchParams.set(API_DETAILS_URL_SEARCH_PARAM_TAB_KEY, tab);
    }
    navigate(location.pathname + `?${newSearchParams.toString()}`, {
      replace: true,
    });
  }, [tab, location.search]);

  //
  // Render
  //
  if (!selectedApiVersion) {
    return null;
  }
  const includesDocumentation = !!selectedApiVersion.documentation;
  return (
    <ContentWidthDiv pageContentIsWide={true}>
      <Tabs value={tab} onTabChange={(v) => setTab(v ?? defaultTabValue)}>
        {/*

        Tab Titles
        */}
        <Tabs.List>
          <Tabs.Tab value={apiProductDetailsTabValues.SPEC}>Spec</Tabs.Tab>
          {includesDocumentation && (
            <Tabs.Tab value={apiProductDetailsTabValues.DOCS}>Docs</Tabs.Tab>
          )}
        </Tabs.List>
        {/*
          
        Tab Content
        */}
        <Tabs.Panel value={apiProductDetailsTabValues.SPEC} pt={"xl"}>
          <SchemaTabContent
            apiProduct={apiProduct}
            apiProductVersions={apiProductVersions}
            apiVersionSpec={apiVersionSpec}
            selectedApiVersion={selectedApiVersion}
          />
        </Tabs.Panel>
        {includesDocumentation && (
          <Tabs.Panel value={apiProductDetailsTabValues.DOCS} pt={"xl"}>
            <DocsTabContent selectedApiVersion={selectedApiVersion} />
          </Tabs.Panel>
        )}
      </Tabs>
    </ContentWidthDiv>
  );
}
