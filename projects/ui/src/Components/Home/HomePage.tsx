import { NavLink } from "react-router-dom";
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

      <div role="region" aria-labelledby="" className="homePageCategories">
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
      </div>
    </PageContainer>
  );
}
