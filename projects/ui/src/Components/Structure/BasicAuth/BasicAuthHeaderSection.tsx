import { useIsLoggedIn } from "../../../Context/AuthContext";
import HeaderSectionLoggedIn from "./HeaderSectionLoggedIn";
import HeaderSectionLoggedOut from "./HeaderSectionLoggedOut";

if (!window.isSecureContext) {
  // eslint-disable-next-line no-console
  console.error(
    "This page is not being delivered in a secure context (see https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts), " +
      "so login will not work."
  );
}

/**
 * MAIN COMPONENT
 **/
export function BasicAuthHeaderSection() {
  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn) {
    return <HeaderSectionLoggedIn />;
  }
  return <HeaderSectionLoggedOut />;
}
