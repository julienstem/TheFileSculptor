import { useConverterContext } from "../../context/ConverterContext/ConverterContext";
import {
  CONVERSION_TYPE_LIST,
  type ConversionType,
} from "../../types/fileTypes";
import StatusCount from "../StatusCount/StatusCount";
import "./mediaSelector.css";
import { useTranslation } from "react-i18next";

export default function MediaSelector() {
  const { t } = useTranslation();
  const {
    currentConversionType,
    changeCurrentConversionType,
    getConversionCounts,
  } = useConverterContext();
  const conversionCounts = getConversionCounts();

  const makeStatusCountList = (type: ConversionType) => {
    const counts = conversionCounts.get(type);
    if (
      !counts ||
      (counts.pending <= 0 &&
        counts.converting <= 0 &&
        counts.completed <= 0 &&
        counts.failed <= 0)
    )
      return null;
    return (
      <div className="status-counts-list">
        {counts.pending !== undefined && counts.pending > 0 && (
          <StatusCount count={counts.pending} status="pending" />
        )}
        {counts.converting !== undefined && counts.converting > 0 && (
          <StatusCount count={counts.converting} status="converting" />
        )}
        {counts.completed !== undefined && counts.completed > 0 && (
          <StatusCount count={counts.completed} status="completed" />
        )}
        {counts.failed !== undefined && counts.failed > 0 && (
          <StatusCount count={counts.failed} status="failed" />
        )}
      </div>
    );
  };
  return (
    <div className="media-selector">
      {CONVERSION_TYPE_LIST.map((type) => (
        <div className="media-selector-container" key={type}>
          <button
            key={type}
            className={
              "conversion-type-button" +
              (type === currentConversionType ? " selected" : "")
            }
            onClick={() => changeCurrentConversionType(type)}
          >
            <div className="button-info">
              {t(`mediaSelector.${type}`)}
              {makeStatusCountList(type)}
            </div>
          </button>
        </div>
      ))}
    </div>
  );
}
