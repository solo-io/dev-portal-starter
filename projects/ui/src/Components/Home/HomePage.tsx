import PageContainer from "../Common/PageContainer";
import {
  BannerHeading,
  BannerHeadingTitle,
} from "../Common/Banner/BannerHeading";
import { Icon } from "../../Assets/Icons";
import { NavLink } from "react-router-dom";
import Button from "../Common/Button";

export function HomePage() {
  return (
    <PageContainer>
      <div>
        <BannerHeading
          title={<BannerHeadingTitle text={"Developers Welcome!"} />}
          description={
            "Welcome to the Acme Co. Developer Portal. Connect, partner, and build with us to create the next generation of digital experiences."
          }
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

      <NavLink to="/api-details/portal-rt-istio-gateway-ns-cluster-1/">
        DEETS
      </NavLink>
      <div role="region" aria-labelledby="" className="homePageCategories">
        <h3>API Categories</h3>
        <div className="categoriesList">
          <div className="categoryCard">
            <div className="categoryImage">
              <Icon.Bug />
            </div>
            <div className="categoryName">Partners</div>
            <div className="categoryDescription">
              Partner APIs for onboarding, relationship management, and unified customer experience
            </div>
          </div>
          <div className="categoryCard">
            <div className="categoryImage">
              <Icon.WrenchGear />
            </div>
            <div className="categoryName">Customers</div>
            <div className="categoryDescription">
            Customer-facing APIs to drive new experiences from third-party client applications
            </div>
          </div>
          <div className="categoryCard">
            <div className="categoryImage">
              <Icon.Lock />
            </div>
            <div className="categoryName">Digital Experience</div>
            <div className="categoryDescription">
              Next generation digital experience APIs to enable the most advanced API-based integration available in the market today.
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
