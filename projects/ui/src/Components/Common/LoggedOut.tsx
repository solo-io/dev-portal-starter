import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PortalAuthContext } from "../../Context/PortalAuthContext";

const LoggedOut = () => {
  const { onLogout } = useContext(PortalAuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    onLogout();
    navigate("/");
  }, []);

  return null;
};

export default LoggedOut;
