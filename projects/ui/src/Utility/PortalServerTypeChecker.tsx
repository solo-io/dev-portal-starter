import { useListApis } from "../Apis/hooks";

const PortalServerTypeChecker = () => {
  // The useListApis call updates the PortalAppContext's portalServerType field.
  // So in order to keep the PortalServerType updated, we just have to call useListApis().
  useListApis();
  return null;
};

export default PortalServerTypeChecker;
