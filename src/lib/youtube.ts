const CHANNEL_HANDLE = "@icctv-101";
const CHANNEL_URL = "https://youtube.com/@icctv-101?si=kp51y50RG4r6icuu";
const LIVE_URL = "https://www.youtube.com/@icctv-101/live";
const STREAMS_URL = "https://www.youtube.com/@icctv-101/streams";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export interface YoutubeStreamItem {
  videoId: string;
  title: string;
  subtitle: string;
  url: string;
}

export interface YoutubeLiveStatus {
  isLive: boolean;
  videoId: string | null;
  channelUrl: string;
  liveUrl: string;
  latestVideo: YoutubeStreamItem | null;
  recentStreams: YoutubeStreamItem[];
}

const FALLBACK_STREAMS: YoutubeStreamItem[] = [
  {
    videoId: "FGd6mF5Qm-A",
    title: "Cielos abiertos",
    subtitle: "Última reunión transmitida",
    url: "https://www.youtube.com/watch?v=FGd6mF5Qm-A",
  },
  {
    videoId: "cLafWXod2BI",
    title: "No abandones el proceso",
    subtitle: "Transmisión en vivo",
    url: "https://www.youtube.com/watch?v=cLafWXod2BI",
  },
  {
    videoId: "oQfk9kjv1Rw",
    title: "Obedientes a la instruccion",
    subtitle: "Transmisión en vivo",
    url: "https://www.youtube.com/watch?v=oQfk9kjv1Rw",
  },
  {
    videoId: "40eM9Gsg7ek",
    title: "El reino de Dios",
    subtitle: "Transmisión en vivo",
    url: "https://www.youtube.com/watch?v=40eM9Gsg7ek",
  },
];

export async function fetchRecentStreams(): Promise<YoutubeStreamItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(STREAMS_URL, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept-Language": "es-MX,es;q=0.9,en;q=0.8",
      },
      signal: controller.signal,
      next: { revalidate: 300 }, // Cache 5 min
    });

    clearTimeout(timeoutId);
    if (!res.ok) return FALLBACK_STREAMS;

    const text = await res.text();
    const rawData = text.match(/ytInitialData\s*=\s*({.+?});<\/script>/)?.[1];
    if (!rawData) return FALLBACK_STREAMS;

    const json = JSON.parse(rawData);

    function findRichItems(obj: any): any[] {
      let items: any[] = [];
      if (!obj || typeof obj !== "object") return items;
      if (obj.richItemRenderer) items.push(obj.richItemRenderer);
      for (const k of Object.keys(obj)) {
        items = items.concat(findRichItems(obj[k]));
      }
      return items;
    }

    const richItems = findRichItems(json);
    const streams: YoutubeStreamItem[] = [];

    for (const item of richItems) {
      const lockup = item?.content?.lockupViewModel;
      if (!lockup) continue;
      const videoId =
        lockup.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint?.videoId ||
        lockup.contentImage?.thumbnailViewModel?.overlays?.[0]?.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.animationActivationTargetId;
      if (!videoId) continue;

      const title =
        lockup.metadata?.lockupMetadataViewModel?.title?.content ||
        lockup.rendererContext?.accessibilityContext?.label ||
        "Reunión en Vivo";

      const metadataLines =
        lockup.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows;
      const subtitle =
        metadataLines?.[0]?.metadataParts?.map((p: any) => p?.text?.content).filter(Boolean).join(" · ") ||
        "Transmitido por ICCTV";

      streams.push({
        videoId,
        title,
        subtitle,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }

    return streams.length > 0 ? streams.slice(0, 8) : FALLBACK_STREAMS;
  } catch {
    return FALLBACK_STREAMS;
  }
}

export async function getYoutubeLiveStatus(): Promise<YoutubeLiveStatus> {
  const [liveCheck, recentStreams] = await Promise.all([
    (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(LIVE_URL, {
          headers: {
            "User-Agent": USER_AGENT,
            "Accept-Language": "es-MX,es;q=0.9,en;q=0.8",
          },
          signal: controller.signal,
          next: { revalidate: 60 },
        });

        clearTimeout(timeoutId);
        if (!res.ok) return { isLive: false, videoId: null };

        const text = await res.text();
        const finalUrl = res.url || "";

        const isLive =
          text.includes('"isLive":true') ||
          text.includes('"status":"LIVE"') ||
          text.includes('"isLiveBroadcast":true') ||
          (finalUrl.includes("/watch?v=") &&
            !text.includes('"isLiveContent":false') &&
            text.includes('"isLive":true'));

        const videoIdMatch = text.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        return { isLive, videoId: isLive ? videoId : null };
      } catch {
        return { isLive: false, videoId: null };
      }
    })(),
    fetchRecentStreams(),
  ]);

  const latestVideo = recentStreams.length > 0 ? recentStreams[0] : FALLBACK_STREAMS[0];

  return {
    isLive: liveCheck.isLive,
    videoId: liveCheck.videoId || (liveCheck.isLive ? latestVideo?.videoId || null : null),
    channelUrl: CHANNEL_URL,
    liveUrl: LIVE_URL,
    latestVideo,
    recentStreams,
  };
}
