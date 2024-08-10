import { handlers } from "auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  console.log(`API Auth POST ${url.pathname}`);
  return await handlers.POST(req);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  console.log(`API Auth GET ${url.pathname}`);
  return await handlers.GET(req);
}
