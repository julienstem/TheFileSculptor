import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <h1>The File Sculptor</h1>
      <ThemeToggle />
    </header>
  );
}
