import DragDrop from "../../components/DragDrop/DragDrop";
import TypeSelector from "../../components/TypeSelector/TypeSelector";
import { useConverterContext } from "../../context/ConverterContext/ConverterContext";
import "./ConveterPage.css";

export default function ConverterPage() {
  const { setOutputFileType } = useConverterContext();
  return (
    <div className="converter-page">
      <div className="file-converter-container">
        <h1>Converter Page</h1>
        <div className="file-converter-manager">
          <div className="file-selector">
            <TypeSelector
              text="Convert to:"
              onChange={(value) => setOutputFileType(value)}
            />
          </div>
          <DragDrop />
        </div>
      </div>
    </div>
  );
}
