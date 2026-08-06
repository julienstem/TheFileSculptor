import React from "react";
import type { FileType } from "../../types/fileTypes";

interface ConverterContextType {
  outputFileType: FileType;
  setOutputFileType: (type: FileType) => void;
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

  return (
    <ConverterContext.Provider
      value={{
        outputFileType,
        setOutputFileType,
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
