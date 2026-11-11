/** Pre-sized responsive set of a hero photo (AVIF 750 / 1280 / 1920 / 2560). */
export type HeroImage = {
  desktop: string;
  fallback: string;
  laptop?: string;
  mobile?: string;
  position?: "center" | "top";
  tablet?: string;
  type?: "image/avif";
};

const imagePositionClasses = {
  center: "object-center",
  top: "object-top",
};

/**
 * Hero photo as <picture>: the local sources are already optimized for the
 * hero, so next/image is not used. `priority` marks the LCP image of a
 * static hero (high fetch priority, no lazy loading).
 */
export function HeroPicture({ image, alt = "", priority = false }: { image: HeroImage; alt?: string; priority?: boolean }) {
  const position = imagePositionClasses[image.position ?? "center"];

  return (
    <picture className="block size-full">
      {image.mobile ? <source media="(max-width: 767px)" srcSet={image.mobile} type={image.type} /> : null}
      {image.tablet ? <source media="(max-width: 1279px)" srcSet={image.tablet} type={image.type} /> : null}
      {image.laptop ? <source media="(max-width: 1919px)" srcSet={image.laptop} type={image.type} /> : null}
      {image.type ? <source srcSet={image.desktop} type={image.type} /> : null}
      <img
        src={image.fallback}
        alt={alt}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
        className={`hero__image ${position}`}
      />
    </picture>
  );
}
