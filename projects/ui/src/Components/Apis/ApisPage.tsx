import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { GG_ApisPage } from "./gloo-gateway-components/GG_ApisPage";
import { GMG_ApisPage } from "./gloo-mesh-gateway-components/GMG_ApisPage";

export function ApisPage() {
  const { portalServerType } = useContext(AppContext);

  if (portalServerType === "gloo-gateway") {
    return <GG_ApisPage />;
  }
  if (portalServerType === "gloo-mesh-gateway") {
    return <GMG_ApisPage />;
  }
  return null;
}
