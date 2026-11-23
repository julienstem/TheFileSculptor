import { FileUploader } from "react-drag-drop-files";
import "./DragDrop.css";
import { useConverterContext } from "../../context/ConverterContext/ConverterContext";

export default function DragDrop() {
  const {
    availableFileTypes: fileTypes,
    addFile,
    outputFileType,
  } = useConverterContext();

  const handleChange = (incomingFiles: File | FileList | File[]) => {
    let filesArray: File[] = [];

    if (incomingFiles instanceof FileList) {
      filesArray = Array.from(incomingFiles);
    } else if (Array.isArray(incomingFiles)) {
      filesArray = incomingFiles;
    } else if (incomingFiles instanceof File) {
      filesArray = [incomingFiles];
    }

    filesArray.forEach((file) => addFile(file));
  };

  return (
    <div className="drag-drop">
      <div className="drag-drop-container">
        <FileUploader
          classes="drag-drop-file-uploader"
          handleChange={handleChange}
          types={fileTypes as string[]}
          multiple={true}
        >
          <div className="drag-drop-content">
            <p>Drag and drop or click to select files to convert to </p>
            <p>{outputFileType}</p>
          </div>
        </FileUploader>
      </div>
    </div>
  );
}
