import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { type FileType } from "../types/fileTypes";

let ffmpeg: FFmpeg | null = null;

export const loadFFmpeg = async (): Promise<FFmpeg> => {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  return ffmpeg;
};

export const convertAudioFile = async (
  file: File,
  targetFormat: FileType,
  onProgress?: (progress: number) => void,
): Promise<File> => {
  const ffmpegInstance = await loadFFmpeg();

  // 1. Create a safe progress handler and attach it
  const handleProgress = ({ progress }: { progress: number }) => {
    if (onProgress) {
      onProgress(Math.round(progress * 100));
    }
  };
  ffmpegInstance.on("progress", handleProgress);

  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const inputExt = file.name.split(".").pop() || "wav";
  const outputExt = targetFormat.toLowerCase();

  const internalInputName = `input_${uniqueId}.${inputExt}`;
  const internalOutputName = `output_${uniqueId}.${outputExt}`;

  const baseName =
    file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
  const userOutputFileName = `${baseName}.${outputExt}`;

  try {
    await ffmpegInstance.writeFile(internalInputName, await fetchFile(file));

    await ffmpegInstance.exec(["-i", internalInputName, internalOutputName]);

    const data = (await ffmpegInstance.readFile(
      internalOutputName,
    )) as Uint8Array;

    const standardBuffer = data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength,
    ) as ArrayBuffer;

    const blob = new Blob([standardBuffer], { type: `audio/${outputExt}` });

    return new File([blob], userOutputFileName, { type: `audio/${outputExt}` });
  } finally {
    ffmpegInstance.off("progress", handleProgress);
    console.log("Cleaning up temporary files in FFmpeg.");

    try {
      await ffmpegInstance.deleteFile(internalInputName);
      await ffmpegInstance.deleteFile(internalOutputName);
    } catch {
      console.warn("Failed to clean up temporary files in FFmpeg.");
    }
  }
};
