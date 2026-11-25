import { IoMdClose } from "react-icons/io";
import { useConverterContext } from "../../context/ConverterContext/ConverterContext";
import DragDrop from "../DragDrop/DragDrop";
import "./RenderList.css";

export default function RenderList() {
  const { fileList, removeConversion } = useConverterContext();
  if (fileList.length === 0) {
    return (
      <div className="table-scroll-container">
        <DragDrop />
      </div>
    );
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
}
