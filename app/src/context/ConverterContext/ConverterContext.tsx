import React, { createContext, useContext, useState } from "react";
import {
  CONVERSTION_TYPES,
  type ConversionType,
  type FileType,
} from "../../types/fileTypes";
import type { Conversion } from "../../types/Conversion";
import { useZipDownload } from "../../hooks/useZipDownload";
import { convertFile } from "../../hooks/convertFile";

interface ConverterContextType {
  fileList: Conversion[];
  outputFileType: FileType;
  setOutputFileType: (type: FileType) => void;
  addFile: (file: File) => void;
  clearFiles: () => void;
  removeConversion: (id: string) => void;
  convertFiles: () => Promise<void>;
  downloadConvertedFiles: () => void;
  isConverting: boolean;
  isDownloading: boolean;
  currentConversionType: ConversionType;
  changeCurrentConversionType: (type: ConversionType) => void;
  availableFileTypes: readonly FileType[];
}

interface ConverterProviderProps {
  children: React.ReactNode;
}

const ConverterContext = createContext<ConverterContextType | undefined>(
  undefined,
);

export const ConverterProvider: React.FC<ConverterProviderProps> = ({
  children,
}) => {
  const [currentConversionType, setCurrentConversionType] =
    useState<ConversionType>("Music");
  const [outputFileType, setOutputFileType] = useState<FileType>(
    CONVERSTION_TYPES["Music"][0],
  );
  const [fileList, setFileList] = useState<Conversion[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const { downloadZip } = useZipDownload();

  const availableFileTypes: readonly FileType[] =
    CONVERSTION_TYPES[currentConversionType];

  const addFile = (file: File) => {
    const newConversion: Conversion = {
      id: crypto.randomUUID(),
      status: "pending",
      inputFile: file,
      outputFile: undefined,
      outputFileType: outputFileType,
    };
    setFileList((prev) => [...prev, newConversion]);
  };

  const removeConversion = (id: string) => {
    setFileList((prev) => prev.filter((item) => item.id !== id));
  };

  const clearFiles = () => {
    setFileList([]);
  };

  const changeCurrentConversionType = (type: ConversionType) => {
    if (type === currentConversionType) return;
    setCurrentConversionType(type);
    setOutputFileType(CONVERSTION_TYPES[type][0]);
    setFileList([]);
  };

  const updateItem = (id: string, updates: Partial<Conversion>) => {
    setFileList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const convertFiles = async () => {
    setIsConverting(true);
    const conversionPromises = fileList.map(async (conversion) => {
      if (
        !conversion.inputFile ||
        (conversion.status === "completed" &&
          conversion.outputFileType === outputFileType)
      ) {
        return;
      }

      updateItem(conversion.id, { status: "converting" });

      try {
        const convertedFile = await convertFile(
          conversion.inputFile,
          currentConversionType,
          outputFileType,
        );

        updateItem(conversion.id, {
          outputFile: convertedFile,
          outputFileType: outputFileType,
          status: "completed",
        });
      } catch (error) {
        console.error(`Error converting ${conversion.inputFile.name}:`, error);
        updateItem(conversion.id, { status: "failed" });
      }
    });

    await Promise.all(conversionPromises);
    setIsConverting(false);
  };

  const downloadConvertedFiles = async () => {
    setIsDownloading(true);
    const completedFiles = fileList.filter(
      (conversion) =>
        conversion.status === "completed" && conversion.outputFile,
    );
    if (completedFiles.length === 0) {
      console.warn("No completed files available for download.");
      setIsDownloading(false);
      return;
    }
    await downloadZip(
      completedFiles.map((conversion) => conversion.outputFile!),
      "converted_files.zip",
    );
    setIsDownloading(false);
  };

  return (
    <ConverterContext.Provider
      value={{
        outputFileType,
        setOutputFileType,
        fileList,
        addFile,
        clearFiles,
        removeConversion,
        convertFiles,
        isConverting,
        isDownloading,
        downloadConvertedFiles,
        currentConversionType,
        changeCurrentConversionType,
        availableFileTypes,
      }}
    >
      {children}
    </ConverterContext.Provider>
  );
};

export const useConverterContext = (): ConverterContextType => {
  const context = useContext(ConverterContext);
  if (!context) {
    throw new Error(
      "useConverterContext must be used within a ConverterProvider",
    );
  }
  return context;
};
