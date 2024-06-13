import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Icon } from "../../Assets/Icons";
import { makePrimaryTrimmedSmallWhiteContainerCSS } from "../../Styles/PrimaryTrimmedSmallWhiteContainer";
import { borderRadiusConstants } from "../../Styles/constants";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { PageContainer } from "../Common/PageContainer";
import { APIUsagePlansList } from "./UsagePlanList/APIUsagePlansList";

const StyledApiUsagePlansList = styled.main(
  ({ theme }) => css`
    margin-bottom: 30px;
    padding: 0 30px;

    .apiUsagePlanCard {
      width: 100%;
      border-radius: ${borderRadiusConstants.small};
      box-shadow: 0px 2px 8px ${theme.darkGreyTransparent};
      border: 1px solid ${theme.splashBlue};
      margin-bottom: 30px;

      .apiHeader {
        display: flex;
        align-items: center;
        width: 100%;
        border-radius: ${borderRadiusConstants.small}
          ${borderRadiusConstants.small} 0 0;
        height: 128px;
        padding: 0 22px;
        background-color: ${theme.lightGreyTransparent};

        // Interaction
        cursor: pointer;
        transition: 0.1s background-color;
        &:hover {
          background-color: ${theme.lightGreyTransparentDark10};
        }
        &:active {
          background-color: ${theme.lightGreyTransparentDark25};
        }

        .leadIconHolder {
          display: flex;
          align-items: center;
          padding-right: 20px;

          svg {
            width: 60px;
            height: 60px;
          }
        }

        .apiDetails {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 250px;
          height: 100%;
          padding: 18px 0 26px;
          margin-right: 30px;
          flex-grow: 1;

          &:before {
            content: "";
            height: 100%;
            width: 1px;
            background: ${theme.splashBlue};
            margin-right: 25px;
          }

          .title {
            text-align: left;
            padding-top: 5px;
            padding-bottom: 5px;

            font-size: 22px;
            line-height: 28px;
            font-weight: 600;
            color: ${theme.defaultColoredText};
          }
          .subtitle-list {
            text-align: left;
            display: flex;
            flex-direction: column;
            margin-bottom: 2px;
            margin-top: -2px;
            .subtitle-item {
              margin: -3px 0;
              font-size: 14px;
              font-weight: 500;
              color: ${theme.defaultColoredText};
            }
          }
          .description {
            text-align: left;
            font-size: 16px;
            line-height: 22px;
            font-weight: 400;
            color: ${theme.augustGrey};

            max-height: 50px;
            overflow-y: auto;
          }
        }

        .metaDetails {
          position: relative;
          display: flex;
          align-items: center;
          padding-left: 20px;

          .metaDetail {
            display: flex;
            align-items: center;
            color: ${theme.defaultColoredText};

            &:nth-of-type(2) {
              margin-left: 50px;
            }

            .metaDetailIcon {
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 42px;
              width: 42px;
              height: 42px;
              margin-right: 12px;
              background-color: ${theme.oceanBlue};

              svg {
                margin-top: -2px;
                width: 24px;
                height: 24px;

                * {
                  fill: white;
                }
              }
            }

            .countNumber {
              font-weight: 600;
              margin-right: 5px;
            }
          }
        }

        .viewToggleArrowHolder {
          margin-left: 35px;

          svg {
            width: 20px;
            height: 20px;
          }
        }
      }

      .usagePlansList {
        background: white;

        overflow: hidden;
        &.hidden {
          max-height: 0;
        }
        &.showing {
          max-height: 1000px;
          overflow: auto;
        }

        .usagePlansListContent {
          margin: 20px;

          .usagePlanDetails {
            margin-bottom: 20px;

            &:last-of-type {
              margin-bottom: 0;
            }

            .planHeader {
              display: flex;
              align-items: center;
              justify-content: space-between;

              > div {
                display: flex;
                align-items: center;
              }
              .planName {
                margin-right: 8px;
                text-transform: capitalize;
              }
              .planRate {
                font-size: 16px;
                line-height: 20px;
                color: ${theme.augustGrey};
              }
            }
          }
        }
      }

      .apiFooter {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 25px;
        height: 43px;
        border-radius: ${`0 0 ${borderRadiusConstants.small} ${borderRadiusConstants.small}`};

        background: ${theme.splashBlue};

        .metaInfo {
          display: flex;
          align-items: center;

          svg {
            margin-right: 10px;
            width: 20px;
            height: 20px;

            * {
              fill: ${theme.primary};
            }
          }

          .typeTitle {
            ${makePrimaryTrimmedSmallWhiteContainerCSS(theme)};
            font-size: 14px;
            line-height: 22px;
          }
        }
        .typeIcon {
          display: flex;
          align-items: center;

          svg {
            width: 28px;
            height: 28px;

            * {
              fill: ${theme.primary};
            }
          }
        }
      }
    }
  `
);

/**
 * MAIN COMPONENT
 **/
export function UsagePlansPage() {
  return (
    <PageContainer>
      <BannerHeading
        title={
          <BannerHeadingTitle
            text={"API Usage Plans & Keys"}
            logo={<Icon.CodeGear />}
          />
        }
        description="View usage plans and manage API Keys for all your APIs."
        breadcrumbItems={[
          { label: "Home", link: "/" },
          { label: "API Usage Plans & Keys" },
        ]}
      />
      <StyledApiUsagePlansList>
        <ErrorBoundary fallback="There was an issue loading the list of Apis">
          <APIUsagePlansList />
        </ErrorBoundary>
      </StyledApiUsagePlansList>
    </PageContainer>
  );
}
