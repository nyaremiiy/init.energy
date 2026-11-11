"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

/**
 * Hero video: the poster is the LCP image (next/image, priority); the video
 * is mounted only after the page has loaded, and never with reduced motion
 * or the browser's data saver.
 */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;
    if (reduced || saveData) return;

    const start = () => setPlay(true);
    if (document.readyState === "complete") {
      const id = window.setTimeout(start, 0);
      return () => window.clearTimeout(id);
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  return (
    <>
      <Image src={poster} alt="" fill priority sizes="100vw" className="hero__image" />
      {play ? (
        <video
          className="hero__image absolute inset-0"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        />
      ) : null}
    </>
  );
}
