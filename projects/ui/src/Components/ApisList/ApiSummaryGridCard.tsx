import { API } from "../../Apis/api-types";

export function ApiSummaryGridCard({ key, api }: { key?: string; api: API }) {
  //
  // Render
  //
  return (
    <div key={key}>
      <div>HEADER</div>
      <div>{api.title}</div>
    </div>
  );
}
