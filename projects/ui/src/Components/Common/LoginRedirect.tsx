import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "./PageContainer";

const LoginRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
    // setTimeout(() => {
    //   navigate("/");
    // }, 3000);
  }, []);

  return (
    <PageContainer>
      You have been logged in!
      {/* <br />
      Please wait to be redirected to the homepage. */}
    </PageContainer>
  );
};

export default LoginRedirect;
