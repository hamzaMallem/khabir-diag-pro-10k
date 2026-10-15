import { hero, MOBILE_QUERY } from "@/config/hero";

/**
 * Hero video download, kept apart from the video element on purpose.
 *
 * The whole file is fetched into memory and played from a blob URL. Scrubbing then seeks inside local memory
 * instead of asking the server for a new byte range on every scroll, which is what makes it smooth on slow links.
 * The video itself is never re-encoded: quality is untouched.
 *
 * The download starts from a tiny inline script (heroPreloadScript) while the HTML is still being parsed, long
 * before React hydrates. useHeroScrub then picks that download up through `window.__heroPre`.
 */

export type ProgressListener = (loaded: number, total: number) => void;

export interface HeroDownload {
  /** Which variant is being downloaded ("desktop" or "mobile"). */
  id: string;
  promise: Promise<Blob>;
  progress: { loaded: number; total: number };
  listeners: ProgressListener[];
}

declare global {
  interface Window {
    __heroPre?: HeroDownload;
  }
}

/** Data-saver on, or a 2G connection: skip the video, the still frames tell the same story. */
export function shouldSkipVideo(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return Boolean(connection?.saveData) || /2g$/.test(connection?.effectiveType ?? "");
}

/** Fetch a video as a blob and report progress. Used when the early inline download did not run (or is for another variant). */
export function downloadVideo(id: string, src: string, signal?: AbortSignal): HeroDownload {
  const download: HeroDownload = { id, progress: { loaded: 0, total: 0 }, listeners: [], promise: Promise.resolve(new Blob()) };
  download.promise = (async () => {
    const response = await fetch(src, { signal });
    if (!response.ok || !response.body) throw new Error(`video ${response.status}`);
    download.progress.total = Number(response.headers.get("content-length")) || 0;
    const reader = response.body.getReader();
    const chunks: BlobPart[] = [];
    let loaded = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      download.progress.loaded = loaded;
      for (const listener of download.listeners) listener(loaded, download.progress.total);
    }
    return new Blob(chunks, { type: "video/mp4" });
  })();
  return download;
}

/**
 * Inline script placed in the page: starts the right variant's download immediately.
 * Plain ES5 on purpose (it runs before any bundle). Mirrors downloadVideo and shouldSkipVideo above.
 */
export function heroPreloadScript(): string {
  const d = hero.desktop;
  const m = hero.mobile;
  const mobileQuery = JSON.stringify(MOBILE_QUERY);
  const mobilePick = JSON.stringify([m.id, m.src]);
  const desktopPick = JSON.stringify([d.id, d.src]);
  return `(function(){try{var c=navigator.connection||{};if(matchMedia("(prefers-reduced-motion: reduce)").matches||c.saveData||/2g$/.test(c.effectiveType||""))return;var v=matchMedia(${mobileQuery}).matches?${mobilePick}:${desktopPick};var P={id:v[0],progress:{loaded:0,total:0},listeners:[]};P.promise=fetch(v[1]).then(function(r){if(!r.ok||!r.body)throw 0;P.progress.total=+r.headers.get("content-length")||0;var rd=r.body.getReader(),ch=[],g=0;return rd.read().then(function f(x){if(x.done)return new Blob(ch,{type:"video/mp4"});ch.push(x.value);g+=x.value.length;P.progress.loaded=g;for(var i=0;i<P.listeners.length;i++)P.listeners[i](g,P.progress.total);return rd.read().then(f)})});P.promise.catch(function(){});window.__heroPre=P}catch(e){}})();`;
}
