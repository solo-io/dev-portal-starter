import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
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
import { consumePostLoginLocation } from "../../../Utility/login/postLoginRedirect";
import { Button } from "../../Common/Button";

const HeaderSectionLoggedOut = () => {
  const { onLogin } = useContext(AuthContext);
  const isLoggedIn = useIsLoggedIn();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  /**
   * Leaves the callback route when the code cannot be exchanged. The identity
   * provider lands the browser on a route that exists only to complete
   * sign-in, so staying there would show the user a sign-in that never
   * finishes. Mirrors where `onLogin` sends them on success.
   */
  const abandonSignIn = () => {
    navigate(consumePostLoginLocation() ?? "/", { replace: true });
  };

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
        abandonSignIn();
        return;
      }
      const previousVerifier = localStorage.getItem(
        LOCAL_STORAGE_AUTH_VERIFIER,
      );
      if (!previousVerifier) {
        // eslint-disable-next-line no-console
        console.warn("The previous code 'verifier' was not found.");
        abandonSignIn();
        return;
      }
      //
      // Make the request for the codes.
      try {
        const res = await doAccessTokenRequest(
          {
            code,
            code_verifier: previousVerifier,
            redirect_uri: getPkceRedirectUri(),
          },
          "authorization_code",
        );
        onLogin(res);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("The authorization code could not be exchanged.", error);
        abandonSignIn();
      }
    })();
  }, []);

  return (
    <div className="userLoginArea loggedOut">
      <Button onClick={() => redirectToPkceLogin()}>LOGIN</Button>
    </div>
  );
};

export default HeaderSectionLoggedOut;
