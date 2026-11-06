import { currentLanguage, languages } from "./header-data";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  return (
    <ul
      aria-label="Мова сайту"
      className={`flex items-center gap-1 text-xs font-semibold ${className ?? ""}`}
    >
      {languages.map((language) => {
        const isCurrent = language.code === currentLanguage;
        const baseClasses = "rounded-full px-2.5 py-1 transition-colors";

        return (
          <li key={language.code}>
            {isCurrent || !language.href ? (
              <span
                aria-current={isCurrent ? "true" : undefined}
                aria-disabled={isCurrent ? undefined : "true"}
                lang={language.code}
                className={`${baseClasses} ${isCurrent ? "bg-white text-slate-950" : "text-white/40"}`}
              >
                {language.label}
              </span>
            ) : (
              <a
                href={language.href}
                hrefLang={language.code}
                lang={language.code}
                className={`${baseClasses} text-white/80 hover:text-white`}
              >
                {language.label}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
