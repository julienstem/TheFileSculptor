import { AudioFilePicker } from "../../components/AudioFilePicker/AudioFilePicker";
import DragDrop from "../../components/DragDrop/DragDrop";
import TypeSelector from "../../components/TypeSelector/TypeSelector";
import { useConverterContext } from "../../context/ConverterContext/ConverterContext";
import "./ConveterPage.css";
import { IoMdClose } from "react-icons/io";

export default function ConverterPage() {
  const { fileList, removeConversion, convertFiles, isConverting } =
    useConverterContext();

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
        <h1>Converter Page</h1>
        <div className="file-converter-manager">
          <div className="file-selector">
            <TypeSelector
              text="Convert to:"
              onChange={(value) => setOutputFileType(value)}
              disabled={isConverting}
            />
            <div className="header-actions">
              <AudioFilePicker disabled={isConverting} />
            </div>
            <div className="button-container">
              <button
                className="convert-button"
                onClick={convertFiles}
                disabled={isConverting}
              >
                {isConverting ? "Converting..." : "Convert"}
              </button>
            </div>
          </div>
          {renderList()}
        </div>
      </div>
    </div>
  );
}
