import { useMemo } from "react";
import { Dropdown, type DropdownOption } from "../Dropdown/dropdown";
import { useConverterContext } from "../../context/ConverterContext/ConverterContext";
import { type FileType } from "../../types/fileTypes";

interface TypeSelectorProps {
  onChange: (value: FileType) => void;
  value?: FileType;
  text?: string;
  disabled?: boolean;
}

export default function TypeSelector({
  onChange,
  value,
  text,
  disabled = false,
}: TypeSelectorProps) {
  const { availableFileTypes: fileTypes } = useConverterContext();

  const options = useMemo<DropdownOption<FileType>[]>(
    () => fileTypes.map((type) => ({ value: type, label: type })),
    [fileTypes],
  );

  return (
    <Dropdown<FileType>
      options={options}
      value={value}
      onChange={onChange}
      label={text}
      disabled={disabled}
    />
  );
}
