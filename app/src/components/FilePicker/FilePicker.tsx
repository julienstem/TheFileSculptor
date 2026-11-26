import React, { useRef, type ChangeEvent } from "react";
import { IoMdAdd } from "react-icons/io";
import { useConverterContext } from "../../context/ConverterContext/ConverterContext";

interface FilePickerProps {
  disabled?: boolean;
}

export const FilePicker: React.FC<FilePickerProps> = ({ disabled }) => {
  const { availableFileTypes: fileTypes, addFile } = useConverterContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
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

  const acceptedTypes = fileTypes
    .map((type) => `.${type.toLowerCase()}`)
    .join(",");

  return (
    <div className="file-picker-wrapper">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        multiple
        style={{ display: "none" }}
      />

      <button
        className="icon-button"
        onClick={handleContainerClick}
        disabled={disabled}
      >
        <IoMdAdd />
      </button>
    </div>
  );
};
