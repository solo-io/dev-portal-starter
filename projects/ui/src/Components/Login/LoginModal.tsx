import { Alert, Box, Input } from "@mantine/core";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AccessTokensResponse } from "../../Apis/api-types";
import { Icon } from "../../Assets/Icons";
import { PortalAuthContext } from "../../Context/PortalAuthContext";
import { doAccessTokenRequest } from "../../Utility/accessTokenRequest";
import {
  clientId,
  clientSecret,
  tokenEndpoint,
} from "../../user_variables.tmplr";
import { Button } from "../Common/Button";
import { Modal } from "../Common/Modal";

const LoginForm = () => {
  const { onLogin } = useContext(PortalAuthContext);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const doAccessTokenRequestWithPasswordForm = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    const formData = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as Record<string, string>;
    return await doAccessTokenRequest(
      formData,
      "password",
      tokenEndpoint,
      clientId,
      clientSecret
    );
  };

  const onLoginFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    //
    // Make the access token request.
    //
    let resJSON: AccessTokensResponse | undefined;
    try {
      resJSON = await toast.promise(doAccessTokenRequestWithPasswordForm(e), {
        error: (err: Error) => <>{err.message}</>,
        success: "Logged in!",
        loading: "Logging in...",
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
    //
    // Invoke the callback to save the token.
    //
    if (!!resJSON) {
      onLogin(resJSON as AccessTokensResponse);
    } else {
      setIsLoggingIn(false);
    }
  };

  //
  // Render
  //
  return (
    <>
      <Box mt="sm" mb="sm" px="lg">
        <Alert variant="light" icon={<Icon.UserProfile />} color="primary">
          Log in to view APIs and usage plans that require authentication.
        </Alert>
      </Box>
      <Box mx="sm" mb="sm" px="lg" sx={{ width: "100%" }}>
        <form onSubmit={onLoginFormSubmit}>
          <Box mb={"sm"}>
            <label htmlFor="username">Username</label>
            <Input id="username" name="username" disabled={isLoggingIn} />
          </Box>

          <Box mb={"sm"}>
            <label htmlFor="password-input">Password</label>
            <Input
              id="password"
              name="password"
              type="password"
              disabled={isLoggingIn}
            />
          </Box>

          <Box mt={"xl"} sx={{ textAlign: "right" }}>
            <Button type="submit" color="primary" disabled={isLoggingIn}>
              LOGIN
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
};

const LoginModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <Modal
      onClose={onClose}
      headContent={<h1>Login</h1>}
      bodyContent={<LoginForm />}
    />
  );
};

export default LoginModal;
