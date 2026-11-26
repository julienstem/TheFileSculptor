import type { FileType } from "./fileTypes";

export type ConversionStatus =
  | "pending"
  | "converting"
  | "completed"
  | "failed";

export type Conversion = {
  id: string;
  inputFile: File;
  outputFile?: File;
  outputFileType?: FileType;
  status: ConversionStatus;
};
