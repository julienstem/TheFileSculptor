import Converter from "../../components/Converter/converter";
import "./ConverterPage.css";

export default function ConverterPage() {
  return (
    <div className="converter-page">
      <div className="file-converter-container">
        <h1>The File Sculptor</h1>
        <Converter />
      </div>
    </div>
  );
}
