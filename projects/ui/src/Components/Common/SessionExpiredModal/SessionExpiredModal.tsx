import { Flex } from "@mantine/core";
import { useContext } from "react";
import { Icon } from "../../../Assets/Icons";
import { AuthContext } from "../../../Context/AuthContext";
import { startLogin } from "../../../Utility/loginRedirect";
import { Button } from "../Button";
import { NotificationModal } from "../NotificationModal/NotificationModal";

/**
 * Shown when an expired session is detected and the deployment is configured
 * with `sessionExpiredBehavior === "prompt-login"`. The stale auth state has
 * already been cleared by the time this renders, so dismissing leaves the user
 * on the public/anonymous view.
 */
export function SessionExpiredModal() {
  const { sessionExpired, dismissSessionExpiredPrompt } =
    useContext(AuthContext);

  if (!sessionExpired) {
    return null;
  }

  return (
    <NotificationModal
      onClose={dismissSessionExpiredPrompt}
      headContent={<Icon.Lock />}
      title="Your session has expired"
      bodyContent={
        <Flex direction="column" align="center" gap={20}>
          <div>Please sign in again to continue.</div>
          <Flex gap={10}>
            <Button color="secondary" onClick={dismissSessionExpiredPrompt}>
              Continue as guest
            </Button>
            <Button onClick={() => startLogin()}>Sign in</Button>
          </Flex>
        </Flex>
      }
    />
  );
}
