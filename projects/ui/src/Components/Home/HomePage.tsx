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
          title={<BannerHeadingTitle text={"Lorem ipsum dolor sit amet"} />}
          description={
            "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam"
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
            <div className="categoryName">Lorem ipsum dolor sit amet</div>
            <div className="categoryDescription">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod
            </div>
          </div>
          <div className="categoryCard">
            <div className="categoryImage">
              <Icon.WrenchGear />
            </div>
            <div className="categoryName">Lorem ipsum dolor sit amet</div>
            <div className="categoryDescription">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod
            </div>
          </div>
          <div className="categoryCard">
            <div className="categoryImage">
              <Icon.Lock />
            </div>
            <div className="categoryName">Lorem ipsum dolor sit amet</div>
            <div className="categoryDescription">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod
            </div>
          </div>
          <div className="categoryCard">
            <div className="categoryImage">
              <Icon.NetworkHub />
            </div>
            <div className="categoryName">Lorem ipsum dolor sit amet</div>
            <div className="categoryDescription">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod
            </div>
          </div>
          <div className="categoryCard">
            <div className="categoryImage">
              <Icon.UpstreamRipple />
            </div>
            <div className="categoryName">Lorem ipsum dolor sit amet</div>
            <div className="categoryDescription">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod
            </div>
          </div>
          <div className="categoryCard">
            <div className="categoryImage">
              <Icon.NetworkOfCircles />
            </div>
            <div className="categoryName">Lorem ipsum dolor sit amet</div>
            <div className="categoryDescription">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
