"use client";

import Script from "next/script";

import { useConsent } from "@/lib/consent/ConsentProvider";

/** Tag IDs from the server environment (NEXT_PUBLIC_*: inlined at build time). Missing → skipped. */
const ids = {
  gtm: process.env.NEXT_PUBLIC_GTM_ID,
  ga4: process.env.NEXT_PUBLIC_GA4_ID,
  googleAds: process.env.NEXT_PUBLIC_GADS_ID,
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  tiktokPixel: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
};

/** IDs go into inline scripts: allow only the characters real IDs use. */
const safe = (id: string | undefined) => (id && /^[\w-]+$/.test(id) ? id : undefined);

/**
 * Analytics and ad tags, loaded ONLY for consented categories. Nothing
 * renders before a decision, so no request reaches Google, Meta or TikTok.
 * Consent Mode defaults and updates come from the <head> script and
 * ConsentProvider. Withdrawn consent: tags stop loading on the next page load.
 */
export function ConsentScripts() {
  const { consent } = useConsent();
  if (!consent) return null;

  const gtm = safe(ids.gtm);
  const ga4 = safe(ids.ga4);
  const googleAds = safe(ids.googleAds);
  const metaPixel = safe(ids.metaPixel);
  const tiktokPixel = safe(ids.tiktokPixel);
  const anyGranted = consent.analytics || consent.marketing;
  // gtag.js is shared by GA4 and Google Ads: load it once if either is allowed.
  const gtagId = (consent.analytics && ga4) || (consent.marketing && googleAds) || undefined;

  return (
    <>
      {gtm && anyGranted ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      ) : null}

      {gtagId ? (
        <>
          <Script id="gtag-src" src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
          <Script id="gtag-config" strategy="afterInteractive">
            {`window.gtag('js', new Date());${consent.analytics && ga4 ? `window.gtag('config','${ga4}');` : ""}${consent.marketing && googleAds ? `window.gtag('config','${googleAds}');` : ""}`}
          </Script>
        </>
      ) : null}

      {consent.marketing && metaPixel ? (
        <Script id="meta-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixel}');fbq('track','PageView');`}
        </Script>
      ) : null}

      {consent.marketing && tiktokPixel ? (
        <Script id="tiktok-pixel" strategy="lazyOnload">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${tiktokPixel}');ttq.page();}(window,document,'ttq');`}
        </Script>
      ) : null}
    </>
  );
}
