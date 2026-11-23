import { useConverterContext } from "../../context/ConverterContext/ConverterContext";
import { type FileType } from "../../types/fileTypes";
import "./TypeSelector.css";

interface TypeSelectorProps {
  onChange: (value: FileType) => void;
  text?: string;
  disabled?: boolean;
}

export default function TypeSelector({
  onChange,
  text,
  disabled,
}: TypeSelectorProps) {
  const { availableFileTypes: fileTypes } = useConverterContext();
  return (
    <div className="type-selector">
      {text && <label className="form-label">{text}</label>}
      <select
        onChange={(e) => onChange?.(e.target.value as FileType)}
        disabled={disabled}
      >
        {fileTypes.map((type) => (
          <option className="form-option" key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}
