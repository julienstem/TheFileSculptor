import { useTheme } from "../../context/ThemeContext/ThemeContext";
import "./ThemeToggle.css";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = !(theme === "dark");

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Passer en thème clair" : "Passer en thème sombre"}
      className={`theme-switch ${isDark ? "theme-switch--dark" : ""}`}
      onClick={toggleTheme}
    >
      {/* Repère gauche : cercle plein */}
      <span
        className="theme-switch__icon theme-switch__icon--sun"
        aria-hidden="true"
      />

      {/* Repère droit : croissant de lune */}
      <span
        className="theme-switch__icon theme-switch__icon--moon"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>

      {/* Pastille qui coulisse par-dessus */}
      <span className="theme-switch__thumb" aria-hidden="true" />
    </button>
  );
};
