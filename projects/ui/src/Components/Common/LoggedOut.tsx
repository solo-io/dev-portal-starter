import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const LoggedOut = () => {
  const { onLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    onLogout();
    navigate("/");
  }, []);

  return null;
};

export default LoggedOut;
