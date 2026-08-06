import React from "react";
import type { FileType } from "../../types/fileTypes";

interface ConverterContextType {
  fileList: File[];
  outputFileType: FileType;
  setOutputFileType: (type: FileType) => void;
  addFile: (file: File) => void;
  clearFiles: () => void;
  removeFile: (file: File) => void;
}

interface ConverterProviderProps {
  children: React.ReactNode;
}

const ConverterContext = React.createContext<ConverterContextType | undefined>(
  undefined,
);

export const ConverterProvider: React.FC<ConverterProviderProps> = ({
  children,
}) => {
  const [outputFileType, setOutputFileType] = React.useState<FileType>("Wav");
  const [fileList, setFileList] = React.useState<File[]>([]);

  const addFile = (file: File) => {
    setFileList((prev) => [...prev, file]);
  };

  const removeFile = (file: File) => {
    setFileList((prev) => prev.filter((f) => f !== file));
  };

  const clearFiles = () => {
    setFileList([]);
  };

  return (
    <ConverterContext.Provider
      value={{
        outputFileType,
        setOutputFileType,
        fileList,
        addFile,
        clearFiles,
        removeFile,
      }}
    >
      {children}
    </ConverterContext.Provider>
  );
};

export const useConverterContext = (): ConverterContextType => {
  const context = React.useContext(ConverterContext);
  if (!context) {
    throw new Error(
      "useConverterContext must be used within a ConverterProvider",
    );
  }
  return context;
};
