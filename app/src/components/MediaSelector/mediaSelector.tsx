import { useConverterContext } from "../../context/ConverterContext/ConverterContext";
import { CONVERSION_TYPE_LIST } from "../../types/fileTypes";
import "./mediaSelector.css";

export default function MediaSelector() {
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
          {type}
        </button>
      ))}
    </div>
  );
}
