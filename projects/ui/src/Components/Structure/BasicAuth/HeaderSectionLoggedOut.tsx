import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AuthContext,
  LOCAL_STORAGE_AUTH_STATE,
  LOCAL_STORAGE_AUTH_VERIFIER,
  useIsLoggedIn,
} from "../../../Context/AuthContext";
import { doAccessTokenRequest } from "../../../Utility/accessTokenRequest";
import {
  getPkceRedirectUri,
  redirectToPkceLogin,
} from "../../../Utility/login/loginRedirect";
import { Button } from "../../Common/Button";

const HeaderSectionLoggedOut = () => {
  const { onLogin } = useContext(AuthContext);
  const isLoggedIn = useIsLoggedIn();
  const [searchParams] = useSearchParams();

  //
  // Check if we have the authorization code to log in.
  //
  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        return;
      }
      //
      // Get search params.
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      //
      // Stop here if the code isn't in the URL.
      if (!code) {
        return;
      }
      const previousState = localStorage.getItem(LOCAL_STORAGE_AUTH_STATE);
      if (!!state && state !== previousState) {
        // eslint-disable-next-line no-console
        console.warn(
          "The 'state' returned from the login flow does not match the previously generated 'state' value.",
        );
        return;
      }
      const previousVerifier = localStorage.getItem(
        LOCAL_STORAGE_AUTH_VERIFIER,
      );
      if (!previousVerifier) {
        // eslint-disable-next-line no-console
        console.warn("The previous code 'verifier' was not found.");
        return;
      }
      //
      // Make the request for the codes.
      const res = await doAccessTokenRequest(
        {
          code,
          code_verifier: previousVerifier,
          redirect_uri: getPkceRedirectUri(),
        },
        "authorization_code",
      );
      onLogin(res);
    })();
  }, []);

  return (
    <div className="userLoginArea loggedOut">
      <Button onClick={() => redirectToPkceLogin()}>LOGIN</Button>
    </div>
  );
};

export default HeaderSectionLoggedOut;
