import FileConverterManager from "../FileConverterManager/fileConverterManager";
import "./converter.css";
import MediaSelector from "../MediaSelector/mediaSelector";

export default function Converter() {
  return (
    <div className="converter">
      <MediaSelector />
      <FileConverterManager />
    </div>
  );
}
