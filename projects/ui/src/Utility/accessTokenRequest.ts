export const doAccessTokenRequest = async (
  formData: Record<string, string>,
  grantType: "password" | "refresh_token",
  tokenEndpoint: string,
  clientId: string,
  clientSecret: string
) => {
  //
  // Build the request payload for a new oauth access token.
  //
  formData.grant_type = grantType;
  formData.client_id = clientId;
  formData.client_secret = clientSecret;
  if (
    (!(formData.username ?? "").trim() || !(formData.password ?? "").trim()) &&
    !formData.refresh_token
  ) {
    return undefined;
  }
  //
  // Encode the form request payload.
  //
  const payloadItems: string[] = [];
  for (const property in formData) {
    if (!formData.hasOwnProperty(property)) continue;
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(formData[property]);
    payloadItems.push(`${encodedKey}=${encodedValue}`);
  }
  //
  // Make the request
  //
  const rawRes = await fetch(tokenEndpoint, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    method: "POST",
    body: payloadItems.join("&"),
  });
  let resJSON: any;
  try {
    resJSON = await rawRes.json();
  } catch {
    throw new Error("Error parsing oauth response.");
  }
  if (!!resJSON.error_description) {
    throw new Error(resJSON.error_description);
  }
  if (!!resJSON.error) {
    throw new Error(resJSON.error);
  }
  //
  // Check for the access token in the response.
  //
  if (!resJSON.access_token) {
    throw new Error(
      "No 'access_token' property was found in the oauth response body."
    );
  }
  return resJSON;
};
