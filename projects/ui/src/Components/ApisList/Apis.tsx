import PageContainer from "../Common/PageContainer";
import { ApiSummaryGridCard } from "./ApiSummaryGridCard";
import { ApiSummaryListCard } from "./ApiSummaryListCard";

export function Apis() {
  const [usingGridView, setUsingGridView] = useState(false);

  const apisList = [];

  //
  // Render
  //
  return (
    <PageContainer>
      <div>TOP</div>
      <main>
        <div onClick={() => setUsingGridView((s) => !s)}>FILTERS</div>
        <div>
          {usingGridView
            ? apisList.map((api) => <ApiSummaryGridCard />)
            : apisList.map((api) => <ApiSummaryListCard />)}
        </div>
      </main>
    </PageContainer>
  );
}
