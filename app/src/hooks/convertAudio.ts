import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { type FileType } from "../types/fileTypes";

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

let executionQueue: Promise<any> = Promise.resolve();

export const loadFFmpeg = (): Promise<FFmpeg> => {
  if (ffmpegInstance && ffmpegInstance.loaded) {
    return Promise.resolve(ffmpegInstance);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    const ffmpeg = new FFmpeg();
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm",
      ),
    });

    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  return loadPromise;
};

export const convertAudioFile = async (
  file: File,
  targetFormat: FileType,
  onProgress?: (progress: number) => void,
): Promise<File> => {
  const ffmpeg = await loadFFmpeg();

  // On enchaîne la conversion dans la file d'attente (séquentielle)
  const task = async () => {
    const handleProgress = ({ progress }: { progress: number }) => {
      if (onProgress) {
        onProgress(Math.round(progress * 100));
      }
    };

    ffmpeg.on("progress", handleProgress);

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const inputExt = file.name.split(".").pop() || "wav";
    const outputExt = targetFormat.toLowerCase();

    const internalInputName = `input_${uniqueId}.${inputExt}`;
    const internalOutputName = `output_${uniqueId}.${outputExt}`;

    const baseName =
      file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const userOutputFileName = `${baseName}.${outputExt}`;

    try {
      await ffmpeg.writeFile(internalInputName, await fetchFile(file));
      await ffmpeg.exec(["-i", internalInputName, internalOutputName]);

      const data = (await ffmpeg.readFile(internalOutputName)) as Uint8Array;

      const standardBuffer = data.buffer.slice(
        data.byteOffset,
        data.byteOffset + data.byteLength,
      ) as ArrayBuffer;

      const blob = new Blob([standardBuffer], { type: `audio/${outputExt}` });
      return new File([blob], userOutputFileName, {
        type: `audio/${outputExt}`,
      });
    } finally {
      ffmpeg.off("progress", handleProgress);

      try {
        await ffmpeg.deleteFile(internalInputName);
        await ffmpeg.deleteFile(internalOutputName);
      } catch {
        console.warn("Failed to clean up temporary files in FFmpeg FS.");
      }
    }
  };

  const resultPromise = executionQueue.then(task);
  executionQueue = resultPromise.catch(() => {});
  return resultPromise;
};
