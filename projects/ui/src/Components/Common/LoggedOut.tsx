import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "./PageContainer";

const LoggedOut = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
    // TODO: Figure out UX: https://github.com/solo-io/gloo-mesh-enterprise/issues/8709
    // setTimeout(() => {
    //   navigate("/");
    // }, 3000);
  }, []);

  return (
    <PageContainer>
      You have been logged out.
      {/* <br />
      Please wait to be redirected back to the homepage. */}
    </PageContainer>
  );
};

export default LoggedOut;
