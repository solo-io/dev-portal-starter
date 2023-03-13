import { useParams } from "react-router-dom";
import PageContainer from "../Common/PageContainer";
import { UsagePlansList } from "./ApiKeys/UsagePlansList";

export function UsagePlans() {
  const { apiId } = useParams();

  const usagePlansList = [];
  //
  // Render
  //
  return (
    <PageContainer>
      Overview of Usage Plans
      {apiId !== undefined && (
        <>
          <br />
          Could show specific plans for api: {apiId}
        </>
      )}
      <main>
        <UsagePlansList usagePlansList={usagePlansList} />
      </main>
    </PageContainer>
  );
}
