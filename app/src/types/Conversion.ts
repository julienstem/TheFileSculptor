import type { FileType } from "./fileTypes";

export type Conversion = {
  id: string;
  inputFile: File;
  outputFile?: File;
  outputFileType?: FileType;
  status: "pending" | "converting" | "completed" | "failed";
};
