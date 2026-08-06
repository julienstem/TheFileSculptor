import React, { createContext, useContext, useState } from "react";
import type { FileType } from "../../types/fileTypes";
import { convertAudioFile } from "../../hooks/convertAudio";
import type { Conversion } from "../../types/Conversion";

interface ConverterContextType {
  fileList: Conversion[];
  outputFileType: FileType;
  setOutputFileType: (type: FileType) => void;
  addFile: (file: File) => void;
  clearFiles: () => void;
  removeConversion: (id: string) => void;
  convertFiles: () => Promise<void>;
  isConverting: boolean;
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
  const [outputFileType, setOutputFileType] = useState<FileType>("Wav");
  const [fileList, setFileList] = useState<Conversion[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  // Add file with a unique ID for robust state tracking
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

  // Helper to update a single conversion item safely
  const updateItem = (id: string, updates: Partial<Conversion>) => {
    setFileList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const convertFiles = async () => {
    setIsConverting(true);
    // Process all pending files in parallel using Promise.all
    const conversionPromises = fileList.map(async (conversion) => {
      if (!conversion.inputFile || conversion.status === "completed") {
        return;
      }

      // Mark as converting
      updateItem(conversion.id, { status: "converting" });

      try {
        const convertedFile = await convertAudioFile(
          conversion.inputFile,
          outputFileType,
        );

        // Update file and status in a single state pass
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
