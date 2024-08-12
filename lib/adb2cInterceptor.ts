/**
 * This interceptor is used to modify the response of the azure access token request as it does not strictly follow the OAuth2 spec
 * - The token_type is missing in the response
 * @param originalFetch
 */
export const azureFetchInterceptor =
  (originalFetch: typeof fetch) =>
  async (
    url: Parameters<typeof fetch>[0],
    options: Parameters<typeof fetch>[1] = {}
  ) => {
    const logit = process.env.NODE_ENV !== "production";
    /* Only intercept azure access token request */
    if (logit) {
      console.log(
        `Interceptor URL: ${url} Method: ${options.method}, body: ${options?.body}`
      );
    }

    if (url.toString().includes(".well-known/openid-configuration")) {
      const response = await originalFetch(url, options);
      /* Clone the response to be able to modify it */
      const clonedResponse = response.clone();
      const body = await clonedResponse.json();

      // Fix userinfo_endpoint format
      if (!body.userinfo_endpoint) {
        if (logit) {
          console.log("Adding userinfo_endpoint to openid-configuration");
        }
        body.userinfo_endpoint = process.env.AUTH_AZURE_AD_B2C_USER_INFO;
      }

      /*  Create a new response with the modified body */
      const modifiedResponse = new Response(JSON.stringify(body), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });

      /* Add the original url to the response */
      return Object.defineProperty(modifiedResponse, "url", {
        value: response.url,
      });
    }

    if (url.toString().includes("/token") && options.method === "POST") {
      const response = await originalFetch(url, options);
      /* Clone the response to be able to modify it */
      const clonedResponse = response.clone();
      const body = await clonedResponse.json();
      if (logit) {
        console.log("Azure token response", body);
      }

      // Adding access_token to userinfo response
      if (!body.access_token) {
        if (logit) {
          console.log("No access_token found in response");
        }
        body.access_token = "dummy";
      }

      /*  Create a new response with the modified body */
      const modifiedResponse = new Response(JSON.stringify(body), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });

      /* Add the original url to the response */
      return Object.defineProperty(modifiedResponse, "url", {
        value: response.url,
      });
    }

    return originalFetch(url, options);
  };
