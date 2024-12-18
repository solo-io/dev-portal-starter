import { Box } from "@mantine/core";
import { GridCardStyles } from "../../../Styles/shared/GridCard.style";
import { CustomPage } from "../../../user_variables.tmplr";
import Breadcrumbs from "../../Common/Breadcrumbs";
import MarkdownRenderer from "../../Common/MarkdownRenderer";
import { PageContainer } from "../../Common/PageContainer";

const CustomMarkdownPage = ({
  customPage,
  customPageContent,
}: {
  customPage: CustomPage;
  customPageContent: string;
}) => {
  return (
    <PageContainer>
      <Breadcrumbs
        items={[{ label: "Home", link: "/" }, { label: customPage.title }]}
      />
      <Box mx="30px" mb="30px" mt="20px">
        <GridCardStyles.GridCard wide whiteBg>
          <Box sx={{ textAlign: "left" }}>
            <MarkdownRenderer markdown={customPageContent} />
          </Box>
        </GridCardStyles.GridCard>
      </Box>
    </PageContainer>
  );
};

export default CustomMarkdownPage;
