import { AudioFilePicker } from "../../components/AudioFilePicker/AudioFilePicker";
import DragDrop from "../../components/DragDrop/DragDrop";
import TypeSelector from "../../components/TypeSelector/TypeSelector";
import { useConverterContext } from "../../context/ConverterContext/ConverterContext";
import "./ConverterPage.css";
import { IoMdClose } from "react-icons/io";

export default function ConverterPage() {
  const {
    fileList,
    removeConversion,
    convertFiles,
    isConverting,
    isDownloading,
    downloadConvertedFiles,
  } = useConverterContext();

  const disabled = isConverting || isDownloading;

  const renderList = () => {
    if (fileList.length === 0) {
      return <DragDrop />;
    }
    return (
      <div className="table-scroll-container">
        <table className="file-list-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>File Type</th>
              <th>File Size</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {fileList.map((convertion, index) => (
              <tr key={index}>
                <td>{convertion.inputFile.name}</td>
                <td>{convertion.inputFile.type}</td>
                <td>{(convertion.inputFile.size / 1024).toFixed(2)} KB</td>
                <td className={`status ${convertion.status}`}>
                  {convertion.status}
                </td>
                <td>
                  <button
                    className="icon-button"
                    onClick={() => removeConversion(convertion.id)}
                  >
                    <IoMdClose />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  const { setOutputFileType } = useConverterContext();
  return (
    <div className="converter-page">
      <div className="file-converter-container">
        <h1>The File Sculptor</h1>
        <div className="file-converter-manager">
          <div className="file-selector">
            <TypeSelector
              text="Convert to:"
              onChange={(value) => setOutputFileType(value)}
              disabled={disabled}
            />
            <div className="header-actions">
              <AudioFilePicker disabled={disabled} />
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
                  fileList.filter(
                    (conversion) => conversion.status === "completed",
                  ).length === 0
                }
              >
                {isDownloading ? "Downloading..." : "Download"}
              </button>
            </div>
          </div>
          {renderList()}
        </div>
      </div>
    </div>
  );
}
