import { AudioFilePicker } from "../../components/AudioFilePicker/AudioFilePicker";
import DragDrop from "../../components/DragDrop/DragDrop";
import TypeSelector from "../../components/TypeSelector/TypeSelector";
import { useConverterContext } from "../../context/ConverterContext/ConverterContext";
import "./ConveterPage.css";
import { IoMdClose } from "react-icons/io";

export default function ConverterPage() {
  const { fileList, removeFile } = useConverterContext();

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
            {fileList.map((file, index) => (
              <tr key={index}>
                <td>{file.name}</td>
                <td>{file.type}</td>
                <td>{(file.size / 1024).toFixed(2)} KB</td>
                <td>Pending</td>
                <td>
                  <button
                    className="icon-button"
                    onClick={() => removeFile(file)}
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
            />
            <div className="header-actions">
              <AudioFilePicker />
            </div>
          </div>
          {renderList()}
        </div>
      </div>
    </div>
  );
}
