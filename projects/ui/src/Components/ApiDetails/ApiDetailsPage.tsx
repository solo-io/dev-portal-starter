import { useContext, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { GG_ApiProductDetailsPage } from "./gloo-gateway-components/GG_ApiProductDetailsPage";
import { GMG_ApiDetailsPage } from "./gloo-mesh-gateway-components/GMG_ApiDetailsPage";

export function ApiDetailsPage() {
  const { portalServerType } = useContext(AppContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (portalServerType === "gloo-gateway") {
    return <GG_ApiProductDetailsPage />;
  }
  if (portalServerType === "gloo-mesh-gateway") {
    return <GMG_ApiDetailsPage />;
  }
  return null;
}
