import styled from "@emotion/styled";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { ContentWidthMain } from "../../Styles/ContentWidthHelpers";

export const PageContainerWrapper = styled(ContentWidthMain)`
  display: flex;
  justify-content: center;
`;

export function PageContainer({ children }: { children: any }) {
  const { pageContentIsWide } = useContext(AppContext);
  return (
    <PageContainerWrapper pageContentIsWide={pageContentIsWide}>
      <div className="page-container">{children}</div>
    </PageContainerWrapper>
  );
}
