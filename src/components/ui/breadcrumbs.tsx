import Link from "next/link";

type BreadcrumbsProps = {
  label: string;
  /** The last item is the current page (no link). */
  items: { name: string; href?: string }[];
  tone?: "light" | "dark";
};

const toneClasses = {
  light: {
    text: "text-ink/70",
    link: "hover:text-ink focus-visible:outline-ink",
    current: "text-ink",
  },
  dark: {
    text: "text-white/75",
    link: "hover:text-white focus-visible:outline-white",
    current: "text-white",
  },
};

export function Breadcrumbs({
  label,
  items,
  tone = "light",
}: BreadcrumbsProps) {
  const classes = toneClasses[tone];

  return (
    <nav aria-label={label}>
      <ol
        className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${classes.text}`}
      >
        {items.map((item, index) => {
          const last = index === items.length - 1;

          return (
            <li key={item.name} className="inline-flex items-center gap-2">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className={`transition-colors duration-150 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2 ${classes.link}`}
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={last ? classes.current : undefined}
                >
                  {item.name}
                </span>
              )}
              {last ? null : <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
