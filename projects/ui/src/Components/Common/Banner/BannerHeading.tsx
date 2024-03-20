import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useContext } from "react";
import { AppContext } from "../../../Context/AppContext";
import { ContentWidthDiv } from "../../../Styles/ContentWidthHelpers";
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
  ({ tall, pageContentIsWide, theme }) => css`
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

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 15px;
      overflow: hidden;

      z-index: 0;

      background-color: ${theme.oceanBlue};
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='330' height='330' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23BACBDA' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23BACBDA'%3E%3Ccircle cx='769' cy='229' r='10'/%3E%3Ccircle cx='539' cy='269' r='10'/%3E%3Ccircle cx='603' cy='493' r='10'/%3E%3Ccircle cx='731' cy='737' r='10'/%3E%3Ccircle cx='520' cy='660' r='10'/%3E%3Ccircle cx='309' cy='538' r='10'/%3E%3Ccircle cx='295' cy='764' r='10'/%3E%3Ccircle cx='40' cy='599' r='10'/%3E%3Ccircle cx='102' cy='382' r='10'/%3E%3Ccircle cx='127' cy='80' r='10'/%3E%3Ccircle cx='370' cy='105' r='10'/%3E%3Ccircle cx='578' cy='42' r='10'/%3E%3Ccircle cx='237' cy='261' r='10'/%3E%3Ccircle cx='390' cy='382' r='10'/%3E%3C/g%3E%3C/svg%3E");
      background-size: contain;

      /* border: 1px solid white; */
      /* box-shadow: 0px 0px 10px ${theme.oceanBlue}; */
      border: 1px solid ${theme.oceanBlue};

      &:after {
        content: "";
        width: 100%;
        height: 100%;
        background: linear-gradient(
          225deg,
          ${theme.splashBlue},
          transparent 75%
        );
      }

      img {
        width: 100%;
        min-height: 100%;
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
        max-width: 51%;
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
          {/* <img src={Banner} alt="" role="banner" /> */}
        </div>
      </BannerHeadingContentContainer>
    </>
  );
}
