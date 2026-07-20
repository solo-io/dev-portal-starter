/**
 * Shared login-redirect logic, used by the header's LOGIN button and the
 * session-expired re-login prompt so both start sign-in the same way.
 *
 * Two flows are supported:
 * - OIDC-auth-code (BFF): navigate to the configured callback path; the gateway
 *   handles the rest.
 * - PKCE: generate a code verifier/challenge and redirect to the authorization
 *   endpoint.
 */
import {
  LOCAL_STORAGE_AUTH_STATE,
  LOCAL_STORAGE_AUTH_VERIFIER,
} from "../Context/AuthContext";
import {
  appliedOidcAuthCodeConfig,
  audience,
  authEndpoint,
  clientId,
  oidcAuthCodeConfigCallbackPath,
} from "../user_variables.tmplr";
import { capturePostLoginLocation } from "./postLoginRedirect";

// From https://stackoverflow.com/a/63336562
function dec2hex(dec: number) {
  return ("0" + dec.toString(16)).substr(-2);
}

function generateCodeVerifier() {
  const array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
}

function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

function base64urlencode(a: ArrayBuffer) {
  let str = "";
  const bytes = new Uint8Array(a);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return window
    .btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generateCodeChallengeFromVerifier(v: string) {
  const hashed = await sha256(v);
  return base64urlencode(hashed);
}

/**
 * The PKCE `redirect_uri`. The value sent to the authorization endpoint here
 * and the one sent in the token exchange (HeaderSectionLoggedOut) must be
 * byte-identical, so both use this helper.
 */
export function getPkceRedirectUri() {
  return window.location.origin + window.location.pathname;
}

/** Starts the PKCE authorization-code flow by redirecting to the IdP. */
export async function redirectToPkceLogin() {
  // Remember where to return after the IdP round trip (see postLoginRedirect).
  capturePostLoginLocation();
  const stateValue = window.crypto.randomUUID();
  localStorage.setItem(LOCAL_STORAGE_AUTH_STATE, stateValue);
  const verifier = generateCodeVerifier();
  localStorage.setItem(LOCAL_STORAGE_AUTH_VERIFIER, verifier);
  const codeChallenge = await generateCodeChallengeFromVerifier(verifier);

  let url = `${authEndpoint}?client_id=${clientId}&scope=openid email profile&response_type=code&state=${stateValue}&code_challenge=${codeChallenge}&code_challenge_method=S256&redirect_uri=${getPkceRedirectUri()}`;
  if (!!audience) {
    url += `&audience=${encodeURI(audience)}`;
  }
  window.location.href = url;
}

/** Starts sign-in using whichever auth flow this deployment is configured for. */
export async function startLogin() {
  if (!!appliedOidcAuthCodeConfig) {
    // Remember where to return; the gateway lands us back on "/" after auth, and
    // `PostLoginRedirectHandler` restores this on boot.
    capturePostLoginLocation();
    window.location.href = oidcAuthCodeConfigCallbackPath;
    return;
  }
  await redirectToPkceLogin();
}
