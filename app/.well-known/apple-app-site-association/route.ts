import { NextResponse } from "next/server";

const association = {
  applinks: {
    apps: [],
    details: [
      {
        appID: "F8DS796RUT.me.mianfg.movgr",
        paths: ["/", "/bus*", "/metro*", "/map*"],
      },
    ],
  },
};

export function GET() {
  return NextResponse.json(association, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
