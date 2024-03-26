import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useContext } from "react";
import Banner from "../../../Assets/banner.png";
import { AppContext } from "../../../Context/AppContext";
import { ContentWidthDiv } from "../../../Styles/ContentWidthHelpers";
import { mediaQueryWithScreenSize } from "../../../Styles/breakpoints";
import { borderRadiusConstants } from "../../../Styles/constants";
import Breadcrumbs from "../Breadcrumbs";

const BannerContent = styled.div(
  ({ theme }) => css`
    position: relative;
    display: flex;
    align-items: center;

    left: 0;
    width: 52%;
    max-width: 52%;
    min-height: 187px;
    padding: 35px 40px;

    ${mediaQueryWithScreenSize.largeAndSmaller} {
      width: 60%;
      max-width: 60%;
    }
    ${mediaQueryWithScreenSize.mediumAndSmaller} {
      width: 100%;
      max-width: 100%;
    }

    background: white;

    border-radius: ${borderRadiusConstants.standard};
    border: 1px solid ${theme.splashBlue};

    z-index: 1;
  `
);

const BannerCardRightContent = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;

    .description {
      font-size: 18px;
      line-height: 26px;
      color: ${theme.augustGrey};
    }

    .additionalContent {
      margin-top: 20px;
    }
  `
);

const BigLeftIconContainer = styled.div(
  ({ theme }) => css`
    margin-right: 22px;
    svg {
      width: 140px;
      height: 140px;
      fill: ${theme.primary};
    }
  `
);

const BannerHeadingContentContainer = styled(ContentWidthDiv)<{
  tall: boolean;
}>(
  ({ tall, pageContentIsWide }) => css`
    position: relative;
    padding: 30px 30px 25px;
    margin-bottom: 40px;

    .banner {
      position: absolute;
      top: 10px;
      bottom: 0px;
      right: 30px;
      width: 66%;
      max-width: 66%;
      ${mediaQueryWithScreenSize.largeAndSmaller} {
        width: 70%;
        max-width: 70%;
      }
      ${mediaQueryWithScreenSize.mediumAndSmaller} {
        width: unset;
        max-width: 100%;
        right: 10px;
        left: 10px;
      }

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 15px;
      overflow: hidden;

      z-index: 0;

      img {
        /* width: 100%; */
        min-height: 100%;
        /* size: cover; */
        background-size: contain;
      }
    }

    ${tall &&
    css`
      padding-top: 160px;
      padding-bottom: 130px;
      margin-bottom: 60px;

      .bannerContent {
        min-height: 258px;
        width: 51%;
      }
    `}
    ${pageContentIsWide &&
    css`
      padding: 30px 30px 25px;
      margin-bottom: 40px;
      .banner {
        max-width: 51%;
      }
      /* .bannerHeading {
        max-width: 48%;
      } */
    `}
  `
);

/**
 * MAIN COMPONENT
 **/
export function BannerHeading({
  title,
  description,
  fullIcon,
  additionalContent,
  tall,
  breadcrumbItems,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  fullIcon?: React.ReactNode;
  additionalContent?: React.ReactNode;
  tall?: boolean;
  breadcrumbItems?: { link?: string; label: string }[];
}) {
  const { pageContentIsWide } = useContext(AppContext);

  return (
    <>
      <Breadcrumbs items={breadcrumbItems ?? []} />
      <BannerHeadingContentContainer
        pageContentIsWide={pageContentIsWide}
        tall={!!tall}
      >
        <BannerContent>
          {!!fullIcon && (
            <BigLeftIconContainer>{fullIcon}</BigLeftIconContainer>
          )}
          <BannerCardRightContent>
            {title}
            <div className="description">{description}</div>
            {!!additionalContent && (
              <div className="additionalContent">{additionalContent}</div>
            )}
          </BannerCardRightContent>
        </BannerContent>

        <div className="banner">
          <img src={Banner} alt="" role="banner" />
        </div>
      </BannerHeadingContentContainer>
    </>
  );
}
