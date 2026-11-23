import { FilePicker } from "../FilePicker/FilePicker";
import TypeSelector from "../../components/TypeSelector/TypeSelector";
import { useConverterContext } from "../../context/ConverterContext/ConverterContext";

export default function FileConverterManager() {
  const {
    fileList,
    convertFiles,
    setOutputFileType,
    isConverting,
    isDownloading,
    downloadConvertedFiles,
  } = useConverterContext();

  const disabled = isConverting || isDownloading;

  return (
    <div className="file-converter-manager">
      <div className="file-selector">
        <TypeSelector
          text="Convert to:"
          onChange={(value) => setOutputFileType(value)}
          disabled={disabled}
        />
        <div className="header-actions">
          <FilePicker disabled={disabled} />
        </div>
        <div className="button-container">
          <button
            className="convert-button"
            onClick={convertFiles}
            disabled={disabled}
          >
            {isConverting ? "Converting..." : "Convert"}
          </button>
          <button
            className="download-button"
            onClick={downloadConvertedFiles}
            disabled={
              disabled ||
              fileList.filter((conversion) => conversion.status === "completed")
                .length === 0
            }
          >
            {isDownloading ? "Downloading..." : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
}
