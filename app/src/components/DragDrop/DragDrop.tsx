import { FileUploader } from "react-drag-drop-files";
import { useTranslation } from "react-i18next";
import "./DragDrop.css";
import { useConverterContext } from "../../context/ConverterContext/ConverterContext";

export default function DragDrop() {
  const { t } = useTranslation();
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
            <p>
              {t("dragDrop.prompt")}{" "}
              <span className="highlighted-text drag-drop-format">
                {outputFileType}
              </span>
            </p>
          </div>
        </FileUploader>
      </div>
    </div>
  );
}
