import { Box, Code } from "@mantine/core";
import { useContext } from "react";
import { Icon } from "../../Assets/Icons";
import { AuthContext } from "../../Context/AuthContext";
import { colors } from "../../Styles";
import { apisImageURL } from "../../user_variables.tmplr";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { PageContainer } from "../Common/PageContainer";
import { StyledApisListMain } from "./gloo-mesh-gateway-components/ApisPage.style";

export function EmptyApisPage() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
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
          <Box
            sx={{
              textAlign: "center",
              lineHeight: "2rem",
              backgroundColor: colors.marchGrey,
              padding: "30px",
            }}
          >
            {!isLoggedIn ? (
              <>
                <b>No API Products were found.</b>
                <br />
                <small>
                  To view API Products in private Portals, please log in.
                  <br />
                  To view API Products in public Portals, the Portal resource
                  must have <Code>spec.visibility.public = true</Code>.
                </small>
              </>
            ) : (
              <>No API Products have been created.</>
            )}
          </Box>
          {/* <EmptyData
            topicMessageOverride={
              <>
                {!isLoggedIn ? (
                  <>
                    No API Products were found in any Portals that have
                    `spec.visibility.public = true`.
                    <br />
                    To view API Products in private portals, you must log in.
                  </>
                ) : (
                  <>
                    no API Products have been created that you are able to
                    access.
                  </>
                )}
              </>
            }
          /> */}
        </StyledApisListMain>
      </PageContainer>
    </>
  );
}
