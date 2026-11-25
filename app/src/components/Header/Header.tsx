import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { LanguageToggle } from "../ToggleLanguage/ToggleLanguage";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <h1>The File Sculptor</h1>
      <div className="header__controls">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
