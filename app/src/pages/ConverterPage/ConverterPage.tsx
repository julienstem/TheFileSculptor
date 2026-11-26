import Converter from "../../components/Converter/converter";
import Header from "../../components/Header/Header";
import "./ConverterPage.css";

export default function ConverterPage() {
  return (
    <div className="converter-page">
      <div className="file-converter-container">
        <Header />
        <Converter />
      </div>
    </div>
  );
}
