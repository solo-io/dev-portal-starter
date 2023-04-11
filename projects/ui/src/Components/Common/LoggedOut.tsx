import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "./PageContainer";

const LoggedOut = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
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
