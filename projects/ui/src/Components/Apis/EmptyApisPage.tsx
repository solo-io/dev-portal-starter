import { Code } from "@mantine/core";
import { useContext } from "react";
import { Icon } from "../../Assets/Icons";
import { AuthContext } from "../../Context/AuthContext";
import { apisImageURL } from "../../user_variables.tmplr";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { SimpleEmptyContent } from "../Common/EmptyData";
import { PageContainer } from "../Common/PageContainer";
import { StyledApisListMain } from "./gloo-mesh-gateway-components/ApisPage.style";

export function EmptyApisPage() {
  return (
    <PageContainer>
      <BannerHeading
        bgImageURL={apisImageURL}
        title={<BannerHeadingTitle text={"APIs"} logo={<Icon.CodeGear />} />}
        description={
          "Browse the list of APIs and documentation in this portal. From here you can get the information you need to make API calls."
        }
        breadcrumbItems={[{ label: "Home", link: "/" }, { label: "APIs" }]}
      />
      <StyledApisListMain>
        <EmptyApisPageContent />
      </StyledApisListMain>
    </PageContainer>
  );
}

export const EmptyApisPageContent = () => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!!isLoggedIn)
    return (
      <SimpleEmptyContent>
        No API Products have been created.
      </SimpleEmptyContent>
    );
  return (
    <SimpleEmptyContent title="No API Products were found.">
      <small>
        To view API Products in private Portals, please log in.
        <br />
        To view API Products in public Portals, the Portal resource must have{" "}
        <Code>spec.visibility.public = true</Code>.
      </small>
    </SimpleEmptyContent>
  );
};
