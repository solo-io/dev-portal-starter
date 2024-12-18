import { Box } from "@mantine/core";
import { useContext, useMemo } from "react";
import Banner from "../../../Assets/banner@2x.webp";
import { AppContext } from "../../../Context/AppContext";
import { bannerImageURL } from "../../../user_variables.tmplr";
import Breadcrumbs from "../Breadcrumbs";
import { BannerStyles as Styles } from "./BannerHeading.style";

export function BannerHeading({
  title,
  description,
  fullIcon,
  additionalContent,
  tall,
  breadcrumbItems,
  bgImageURL,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  fullIcon?: React.ReactNode;
  additionalContent?: React.ReactNode;
  tall?: boolean;
  breadcrumbItems?: { link?: string; label: string }[];
  bgImageURL?: string;
}) {
  const { pageContentIsWide } = useContext(AppContext);

  const bgImage = useMemo(() => {
    if (!!bgImageURL) {
      return bgImageURL;
    }
    if (!!bannerImageURL) {
      return bannerImageURL;
    }
    return Banner;
  }, [bgImageURL]);

  return (
    <>
      <Breadcrumbs items={breadcrumbItems ?? []} />
      <Styles.BannerHeadingContentContainer
        pageContentIsWide={pageContentIsWide}
        tall={!!tall}
      >
        <Styles.BannerContent>
          {!!fullIcon && (
            <Styles.BigLeftIconContainer>
              {fullIcon}
            </Styles.BigLeftIconContainer>
          )}
          <Styles.BannerCardRightContent>
            {title}
            <Styles.DescriptionText>{description}</Styles.DescriptionText>
            {!!additionalContent && <Box mt="20px">{additionalContent}</Box>}
          </Styles.BannerCardRightContent>
        </Styles.BannerContent>

        <Styles.BannerImageContainer pageContentIsWide={pageContentIsWide}>
          <img src={bgImage} alt="background" />
        </Styles.BannerImageContainer>
      </Styles.BannerHeadingContentContainer>
    </>
  );
}
