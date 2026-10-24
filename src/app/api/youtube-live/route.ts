import { NextResponse } from "next/server";
import { getYoutubeLiveStatus } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = await getYoutubeLiveStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      {
        isLive: false,
        videoId: null,
        channelUrl: "https://youtube.com/@icctv-101?si=kp51y50RG4r6icuu",
        liveUrl: "https://www.youtube.com/@icctv-101/live",
        latestVideo: null,
        recentStreams: [],
      },
      { status: 200 }
    );
  }
}
