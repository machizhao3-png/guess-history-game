import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "WebSocket endpoint. Use client library to connect.",
  });
}

