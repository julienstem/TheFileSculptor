import React, { createContext, useContext, useState } from "react";
import {
  CONVERSTION_TYPES,
  type ConversionType,
  type FileType,
} from "../../types/fileTypes";
import type { Conversion } from "../../types/Conversion";
import { useZipDownload } from "../../hooks/useZipDownload";
import { convertFile } from "../../hooks/convertFile";

type FileListsByType = Record<ConversionType, Conversion[]>;
type OutputTypesByType = Record<ConversionType, FileType>;

interface ConverterContextType {
  fileList: Conversion[];
  fileListsByType: FileListsByType;
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

const createInitialFileLists = (): FileListsByType => {
  const lists = {} as FileListsByType;
  (Object.keys(CONVERSTION_TYPES) as ConversionType[]).forEach((type) => {
    lists[type] = [];
  });
  return lists;
};

const createInitialOutputTypes = (): OutputTypesByType => {
  const outputs = {} as OutputTypesByType;
  (Object.keys(CONVERSTION_TYPES) as ConversionType[]).forEach((type) => {
    outputs[type] = CONVERSTION_TYPES[type][0];
  });
  return outputs;
};

const ConverterContext = createContext<ConverterContextType | undefined>(
  undefined,
);

export const ConverterProvider: React.FC<ConverterProviderProps> = ({
  children,
}) => {
  const [currentConversionType, setCurrentConversionType] =
    useState<ConversionType>("Audio");

  const [outputFileTypesByType, setOutputFileTypesByType] =
    useState<OutputTypesByType>(createInitialOutputTypes);

  const [fileListsByType, setFileListsByType] = useState<FileListsByType>(
    createInitialFileLists,
  );

  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const { downloadZip } = useZipDownload();

  const fileList = fileListsByType[currentConversionType] ?? [];
  const outputFileType = outputFileTypesByType[currentConversionType];
  const availableFileTypes: readonly FileType[] =
    CONVERSTION_TYPES[currentConversionType];

  const setOutputFileType = (type: FileType) => {
    setOutputFileTypesByType((prev) => ({
      ...prev,
      [currentConversionType]: type,
    }));
  };

  const addFile = (file: File) => {
    const activeType = currentConversionType;
    const activeOutputType = outputFileTypesByType[activeType];

    const newConversion: Conversion = {
      id: crypto.randomUUID(),
      status: "pending",
      inputFile: file,
      outputFile: undefined,
      outputFileType: activeOutputType,
    };

    setFileListsByType((prev) => ({
      ...prev,
      [activeType]: [...(prev[activeType] ?? []), newConversion],
    }));
  };

  const removeConversion = (id: string) => {
    const activeType = currentConversionType;
    setFileListsByType((prev) => ({
      ...prev,
      [activeType]: (prev[activeType] ?? []).filter((item) => item.id !== id),
    }));
  };

  const clearFiles = () => {
    const activeType = currentConversionType;
    setFileListsByType((prev) => ({
      ...prev,
      [activeType]: [],
    }));
  };

  const changeCurrentConversionType = (type: ConversionType) => {
    if (type === currentConversionType) return;
    setCurrentConversionType(type);
    // On ne vide plus fileList et on garde le format de sortie propre à chaque média
  };

  const updateItem = (
    mediaType: ConversionType,
    id: string,
    updates: Partial<Conversion>,
  ) => {
    setFileListsByType((prev) => ({
      ...prev,
      [mediaType]: (prev[mediaType] ?? []).map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    }));
  };

  const convertFiles = async () => {
    const activeType = currentConversionType;
    const activeOutputType = outputFileTypesByType[activeType];
    const currentList = fileListsByType[activeType] ?? [];

    setIsConverting(true);
    const conversionPromises = currentList.map(async (conversion) => {
      if (
        !conversion.inputFile ||
        (conversion.status === "completed" &&
          conversion.outputFileType === activeOutputType)
      ) {
        return;
      }

      updateItem(activeType, conversion.id, { status: "converting" });

      try {
        const convertedFile = await convertFile(
          conversion.inputFile,
          activeType,
          activeOutputType,
        );

        updateItem(activeType, conversion.id, {
          outputFile: convertedFile,
          outputFileType: activeOutputType,
          status: "completed",
        });
      } catch (error) {
        console.error(`Error converting ${conversion.inputFile.name}:`, error);
        updateItem(activeType, conversion.id, { status: "failed" });
      }
    });

    await Promise.all(conversionPromises);
    setIsConverting(false);
  };

  const downloadConvertedFiles = async () => {
    const activeType = currentConversionType;
    const currentList = fileListsByType[activeType] ?? [];

    setIsDownloading(true);
    const completedFiles = currentList.filter(
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
      `${activeType.toLowerCase()}_converted_files.zip`,
    );
    setIsDownloading(false);
  };

  return (
    <ConverterContext.Provider
      value={{
        outputFileType,
        setOutputFileType,
        fileList,
        fileListsByType,
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
