export interface YoutubeLiveStatus {
  isLive: boolean;
  videoId: string | null;
  channelUrl: string;
  liveUrl: string;
}

export async function getYoutubeLiveStatus(): Promise<YoutubeLiveStatus> {
  const channelUrl = "https://youtube.com/@icctv-101?si=kp51y50RG4r6icuu";
  const liveUrl = "https://www.youtube.com/@icctv-101/live";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(liveUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "es-MX,es;q=0.9,en;q=0.8",
      },
      signal: controller.signal,
      next: { revalidate: 60 }, // Cache revalidation every 60s
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return { isLive: false, videoId: null, channelUrl, liveUrl };
    }

    const text = await res.text();
    const finalUrl = res.url || "";

    // YouTube marks live streams with "isLive":true or "status":"LIVE" or "isLiveBroadcast":true
    const isLive =
      text.includes('"isLive":true') ||
      text.includes('"status":"LIVE"') ||
      text.includes('"isLiveBroadcast":true') ||
      (finalUrl.includes("/watch?v=") &&
        !text.includes('"isLiveContent":false') &&
        text.includes('"isLive":true'));

    // Extract active video ID
    const videoIdMatch = text.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    return {
      isLive,
      videoId: isLive ? videoId : null,
      channelUrl,
      liveUrl,
    };
  } catch (error) {
    return { isLive: false, videoId: null, channelUrl, liveUrl };
  }
}
