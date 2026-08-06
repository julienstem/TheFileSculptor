import { FileUploader } from "react-drag-drop-files";
import "./DragDrop.css";
import { FILE_TYPES } from "../../types/fileTypes";
import { useConverterContext } from "../../context/ConverterContext/ConverterContext";

export default function DragDrop() {
  const { addFile } = useConverterContext();
  const handleChange = (file: File | File[]) => {
    (Array.isArray(file) ? file : [file]).forEach(addFile);
  };
  return (
    <div className="drag-drop">
      <div className="drag-drop-container">
        <FileUploader
          classes="drag-drop-file-uploader"
          handleChange={handleChange}
          types={[...FILE_TYPES]}
        >
          <div className="drag-drop-content">
            <p>Drag and drop or click to select files to convert.</p>
          </div>
        </FileUploader>
      </div>
    </div>
  );
}
