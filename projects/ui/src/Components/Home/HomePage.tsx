import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { borderRadiusConstants } from "../../Styles/constants";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Button } from "../Common/Button";
import { PageContainer } from "../Common/PageContainer";

/* TODO: Clean this up. Is there a better way to display this? Should 
    these images be coming from the backend */
import CardImage1 from "../../Assets/card-option-1.png";
import CardImage2 from "../../Assets/card-option-2.png";
import CardImage3 from "../../Assets/card-option-3.png";
import { companyName } from "../../user_variables.tmplr";

const HomePageCategories = styled.div(
  ({ theme }) => css`
    width: 100%;
    padding: 30px;
    margin: 60px 0;
    border-radius: ${borderRadiusConstants.small};

    border: 1px solid ${theme.aprilGrey};
    background: ${theme.lightGreyTransparent};
    color: ${theme.novemberGrey};

    h3 {
      font-size: 34px;
      text-align: center;
      margin-bottom: 20px;
    }

    /*
  *  CATEGORIES GRID AND CARDS
  */
    .categoriesList {
      display: grid;
      grid-gap: 30px;
      grid-template-columns: 1fr 1fr 1fr;

      .categoryCard {
        display: flex;
        flex-direction: column;
        min-height: 260px;
        border-radius: ${borderRadiusConstants.small};

        border: 1px solid ${theme.splashBlue};
        background: ${theme.lightGreyTransparent};
        text-align: center;
        cursor: default;

        .categoryIcon {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100px;
          margin-bottom: 15px;

          svg {
            width: 100px;
            max-height: 100px;
          }
        }
        .categoryImageHolder {
          display: flex;
          align-items: center;
          justify-content: center;

          height: 225px;
          width: calc(100% + 2px);
          overflow: hidden;
          margin: -1px -1px 0;
          border-radius: ${borderRadiusConstants.small}
            ${borderRadiusConstants.small} 0 0;
          margin-bottom: 20px;

          img {
            width: 100%;
            min-height: 100%;
          }
        }

        .categoryName {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 5px;
          padding: 0 40px;
        }
        .categoryDescription {
          font-size: 16px;
          font-weight: 400;
          padding: 0 40px 40px;
        }
      }
    }
  `
);

/**
 * MAIN COMPONENT
 **/
export function HomePage() {
  return (
    <PageContainer>
      <div>
        <BannerHeading
          title={<BannerHeadingTitle text={"Developers Welcome!"} />}
          description={`Welcome to the ${companyName} Developer Portal. Connect, partner, and build with us to create the next generation of digital experiences.`}
          additionalContent={
            <NavLink to="/apis">
              <Button style={{ width: "150px", marginTop: "10px" }}>
                VIEW APIS
              </Button>
            </NavLink>
          }
          tall={true}
        />
      </div>

      <HomePageCategories role="region" aria-labelledby="">
        <h3>API Categories</h3>
        <div className="categoriesList">
          <div className="categoryCard">
            <div className="categoryImageHolder">
              <img src={CardImage1} alt="" role="banner" />
            </div>
            <div className="categoryName">Partners</div>
            <div className="categoryDescription">
              Partner APIs for onboarding, relationship management, and unified
              customer experience
            </div>
          </div>
          <div className="categoryCard">
            <div className="categoryImageHolder">
              <img src={CardImage2} alt="" role="banner" />
            </div>
            <div className="categoryName">Customers</div>
            <div className="categoryDescription">
              Customer-facing APIs to drive new experiences from third-party
              client applications
            </div>
          </div>
          <div className="categoryCard">
            <div className="categoryImageHolder">
              <img src={CardImage3} alt="" role="banner" />
            </div>
            <div className="categoryName">Digital Experience</div>
            <div className="categoryDescription">
              Next generation digital experience APIs to enable the most
              advanced API-based integration available in the market today.
            </div>
          </div>
        </div>
      </HomePageCategories>
    </PageContainer>
  );
}
