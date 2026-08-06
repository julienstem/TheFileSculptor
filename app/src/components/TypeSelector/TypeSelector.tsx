import { FILE_TYPES, type FileType } from "../../types/fileTypes";
import "./TypeSelector.css";

interface TypeSelectorProps {
  onChange: (value: FileType) => void;
  text?: string;
}

export default function TypeSelector({ onChange, text }: TypeSelectorProps) {
  return (
    <div className="type-selector">
      {text && <label className="form-label">{text}</label>}
      <select onChange={(e) => onChange?.(e.target.value as FileType)}>
        {Object.values(FILE_TYPES).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}
