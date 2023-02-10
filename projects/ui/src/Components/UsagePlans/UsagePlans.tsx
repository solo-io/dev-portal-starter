import { useParams } from "react-router-dom";
import PageContainer from "../../Common/PageContainer";

function UsagePlans() {
  const { apiId } = useParams();
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
    </PageContainer>
  );
}

export default UsagePlans;
