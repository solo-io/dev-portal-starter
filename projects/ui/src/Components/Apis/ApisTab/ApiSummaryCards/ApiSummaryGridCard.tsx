import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Badge, Box, Flex } from "@mantine/core";
import Avatar from "boring-avatars";
import { ApiProductSummary } from "../../../../Apis/api-types";
import { Icon } from "../../../../Assets/Icons";
import { colors } from "../../../../Styles";
import { borderRadiusConstants } from "../../../../Styles/constants";
import { GridCardStyles } from "../../../../Styles/shared/GridCard.style";
import { getApiProductDetailsSpecTabLink } from "../../../../Utility/link-builders";

const StyledAvatarContainer = styled.div(
  ({ theme }) => css`
    height: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    svg {
      flex-grow: 1;
      height: fit-content;
    }
    position: relative;
    .details {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: #f8fafbd8;
      transition: 0.2s background-color;
      &:hover {
        background-color: #f8fafbd8;
      }
      &:active {
        background-color: #f8fafbe8;
      }
      *,
      .title {
        font-size: 1.4rem;
      }
      .description {
        color: ${theme.neptuneBlue} !important;
        font-size: 1rem;
      }
      .mantine-Badge-root {
        height: 25px;
        border: 1px solid ${theme.pondBlue};
        span {
          padding: 0px 5px;
          font-weight: 400;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 5px;
          svg {
            width: 18px;
          }
        }
      }
    }
  `
);

/**
 * MAIN COMPONENT
 **/
export function ApiSummaryGridCard({
  apiProduct,
}: {
  apiProduct: ApiProductSummary;
}) {
  return (
    <GridCardStyles.GridCardWithLink
      to={getApiProductDetailsSpecTabLink(apiProduct.id)}
      tabIndex={0}
      style={{
        overflow: "hidden",
        border: `1px solid ${colors.pondBlue}`,
        borderRadius: borderRadiusConstants.standard,
        padding: "0px",
      }}
    >
      <div className="content">
        {/* <div className="apiImageHolder">
          <img src={defaultCardImage} alt="" role="banner" />
        </div>
        <div className="details">
          <div>
            <Box pb={"25px"}>
              <h4 className="title">{apiProduct.name}</h4>
              API Versions: {apiProduct.versionsCount}
              {apiProduct.description && (
                <Box pt={"15px"}>
                  <div className="description">{apiProduct.description}</div>
                </Box>
              )}
            </Box>
          </div>
        </div> */}

        <StyledAvatarContainer>
          <Avatar
            size={"50px"}
            // size={"225px"}
            square
            name={apiProduct.id}
            variant="marble"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
          />
          <div className="details">
            <div>
              <Box pb={"5px"}>
                <h4 className="title">{apiProduct.name}</h4>
                <Flex gap={"10px"}>
                  <Badge variant="light">
                    Versions: {apiProduct.versionsCount}
                  </Badge>
                  <Badge variant="light">
                    <Icon.SmallCodeGear /> OpenAPI
                  </Badge>
                </Flex>
                {apiProduct.description && (
                  <Box pt={"12px"}>
                    <div className="description">{apiProduct.description}</div>
                  </Box>
                )}
              </Box>
            </div>
          </div>
        </StyledAvatarContainer>
      </div>
      {/* <div className="footer">
        <div className="metaInfo">
          <Icon.SmallCodeGear />
          <div className="typeTitle" aria-label="API Type">
            OpenAPI
          </div>
        </div>
        <div className="typeIcon">
          <Icon.OpenApiIcon />
        </div>
      </div> */}
    </GridCardStyles.GridCardWithLink>
  );
}
