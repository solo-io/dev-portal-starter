import { Box } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { useIsAdmin } from "../../Context/AuthContext";
import { companyName, homeImageURL } from "../../user_variables.tmplr";
import { BannerHeading } from "../Common/Banner/BannerHeading";
import { BannerHeadingTitle } from "../Common/Banner/BannerHeadingTitle";
import { Button } from "../Common/Button";
import { PageContainer } from "../Common/PageContainer";
import { useOnApisPageClick } from "../Structure/Header";
import { HomePageStyles } from "./HomePage.style";
import { HomePageCategoryCard } from "./HomePageCategoryCard";

/* TODO: Clean this up. Is there a better way to display this? Should 
    these images be coming from the backend */
import CardImage1 from "../../Assets/card-option-1@2x.webp";
import CardImage2 from "../../Assets/card-option-2@2x.webp";
import CardImage3 from "../../Assets/card-option-3@2x.webp";

export function HomePage() {
  const isAdmin = useIsAdmin();
  const { onApisPageClick } = useOnApisPageClick();

  return (
    <PageContainer>
      <div>
        <BannerHeading
          bgImageURL={homeImageURL}
          title={<BannerHeadingTitle text={"Developers Welcome!"} />}
          description={`Welcome to the ${companyName} Developer Portal. Connect, partner, and build with us to create the next generation of digital experiences.`}
          additionalContent={
            !isAdmin && (
              <NavLink to="/apis" onClick={onApisPageClick}>
                <Button
                  tabIndex={0}
                  style={{ width: "150px", marginTop: "10px" }}
                >
                  VIEW APIS
                </Button>
              </NavLink>
            )
          }
          tall={true}
        />
      </div>

      <HomePageStyles.HomePageCategories role="region">
        <Box p={"10px"}>
          <HomePageStyles.ApiCategoriesTitle>
            API Categories
          </HomePageStyles.ApiCategoriesTitle>
        </Box>
        <HomePageStyles.CategoriesList>
          <HomePageCategoryCard
            imageSrc={CardImage1}
            imageAlt={"placeholder image"}
            categoryName={"Partners"}
            categoryDescription={
              "Partner APIs for onboarding, relationship management, and unified customer experience"
            }
          />
          <HomePageCategoryCard
            imageSrc={CardImage2}
            imageAlt={"placeholder image"}
            categoryName={"Customers"}
            categoryDescription={
              "Customer-facing APIs to drive new experiences from third-party client applications"
            }
          />
          <HomePageCategoryCard
            imageSrc={CardImage3}
            imageAlt={"placeholder image"}
            categoryName={"Digital Experience"}
            categoryDescription={
              "Next generation digital experience APIs to enable the most advanced API-based integration available in the market today"
            }
          />
        </HomePageStyles.CategoriesList>
      </HomePageStyles.HomePageCategories>
    </PageContainer>
  );
}
