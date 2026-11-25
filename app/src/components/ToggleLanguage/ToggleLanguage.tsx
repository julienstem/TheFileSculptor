import { useTranslation } from "react-i18next";
import "./ToggleLanguage.css";

const LANGUAGES = [
  { code: "fr", label: "FR", name: "Français" },
  { code: "en", label: "EN", name: "English" },
] as const;

export const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("fr") ? "fr" : "en";

  const handleSelectLanguage = (lang: "fr" | "en") => {
    if (lang !== currentLang) {
      i18n.changeLanguage(lang);
    }
  };

  return (
    <div
      className="lang-toggle"
      role="group"
      aria-label="Sélecteur de langue / Language selector"
    >
      {LANGUAGES.map(({ code, label, name }) => {
        const isActive = currentLang === code;

        return (
          <button
            key={code}
            type="button"
            className={`lang-toggle__btn ${isActive ? "lang-toggle__btn--active" : ""}`}
            onClick={() => handleSelectLanguage(code)}
            aria-pressed={isActive}
            aria-label={name}
            title={name}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
