import { FilePicker } from "../FilePicker/FilePicker";
import TypeSelector from "../../components/TypeSelector/TypeSelector";
import { useConverterContext } from "../../context/ConverterContext/ConverterContext";
import RenderList from "../RenderList/RenderList";
import "./fileConverterManager.css";
import { useTranslation } from "react-i18next";

export default function FileConverterManager() {
  const { t } = useTranslation();
  const {
    outputFileType,
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
          text={t("typeSelector.convertTo") + ":"}
          onChange={(value) => setOutputFileType(value)}
          disabled={disabled}
          value={outputFileType}
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
            {isConverting
              ? t("convertButton.converting")
              : t("convertButton.convert")}
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
            {isDownloading
              ? t("downloadButton.downloading")
              : t("downloadButton.download")}
          </button>
        </div>
      </div>
      <RenderList />
    </div>
  );
}
