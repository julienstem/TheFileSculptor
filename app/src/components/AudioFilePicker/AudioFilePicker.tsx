import React, { useRef, type ChangeEvent } from "react";
import { FILE_TYPES } from "../../types/fileTypes";
import { IoMdAdd } from "react-icons/io";
import { useConverterContext } from "../../context/ConverterContext/ConverterContext";

interface AudioFilePickerProps {
  disabled?: boolean;
}

export const AudioFilePicker: React.FC<AudioFilePickerProps> = ({
  disabled,
}) => {
  const { addFile } = useConverterContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        addFile(file);
      });

      event.target.value = "";
    }
  };

  const acceptedAudioTypes = FILE_TYPES.map(
    (type) => `.${type.toLowerCase()}`,
  ).join(",");

  return (
    <div className="file-picker-wrapper">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedAudioTypes}
        multiple
        style={{ display: "none" }}
      />

      <div className="icon-button" onClick={handleContainerClick}>
        <IoMdAdd />
      </div>
    </div>
  );
};
