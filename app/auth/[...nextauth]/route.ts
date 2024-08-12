import { handlers } from "auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import { azureFetchInterceptor } from "@/lib/adb2cInterceptor";

const originalFetch = fetch;

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  console.log(`Auth POST ${url.pathname}`);

  global.fetch = azureFetchInterceptor(originalFetch);
  const response = await handlers.POST(req);
  global.fetch = originalFetch;
  return response;

  // if (url.pathname === "/auth/signin/azure-ad-b2c") {
  //   const session = await auth();
  //   if (!session?.user) {
  //     /* Prevent user creation for instagram access token
  //         //   const signInUrl = new URL("/?modal=sign-in", req.url);
  //         //   return NextResponse.redirect(signInUrl);*/
  //     console.log("No user found");
  //   }
  //   /* Intercept the fetch request to patch access_token request to be oauth compliant */
  //   global.fetch = azureFetchInterceptor(originalFetch);
  //   const response = await handlers.POST(req);
  //   global.fetch = originalFetch;
  //   return response;
  // }
  // return await handlers.POST(req);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  console.log(`Auth GET ${url}`);
  global.fetch = azureFetchInterceptor(originalFetch);
  const response = await handlers.GET(req);
  global.fetch = originalFetch;
  return response;
  // if (url.pathname === "/auth/callback/azure-ad-b2c") {
  //   global.fetch = azureFetchInterceptor(originalFetch);
  //   const response = await handlers.GET(req);
  //   global.fetch = originalFetch;
  //   return response;
  // }
  // return await handlers.GET(req);
}
