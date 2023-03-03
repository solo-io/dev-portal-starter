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
          icon={Icon.Bug}
          description={
            "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam"
          }
          additionalContent={
            <Button style={{ width: "150px", marginTop: "10px" }}>
              VIEW APIS
            </Button>
          }
          tall={true}
        />
      </div>
      <div role="region" aria-labelledby="">
        API Categories <NavLink to="/api-details/asdf#/">DEETS</NavLink>
      </div>
    </PageContainer>
  );
}
