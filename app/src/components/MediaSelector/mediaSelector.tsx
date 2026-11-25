import { useConverterContext } from "../../context/ConverterContext/ConverterContext";
import { CONVERSION_TYPE_LIST } from "../../types/fileTypes";
import "./mediaSelector.css";
import { useTranslation } from "react-i18next";

export default function MediaSelector() {
  const { t } = useTranslation();
  const { currentConversionType, changeCurrentConversionType } =
    useConverterContext();
  return (
    <div className="media-selector">
      {CONVERSION_TYPE_LIST.map((type) => (
        <button
          key={type}
          className={
            "conversion-type-button" +
            (type === currentConversionType ? " selected" : "")
          }
          onClick={() => changeCurrentConversionType(type)}
        >
          {t(`mediaSelector.${type}`)}
        </button>
      ))}
    </div>
  );
}
