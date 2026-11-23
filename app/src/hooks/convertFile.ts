import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import type { ConversionType, FileType } from "../types/fileTypes";

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;
let executionQueue: Promise<any> = Promise.resolve();

export const loadFFmpeg = (): Promise<FFmpeg> => {
  if (ffmpegInstance && ffmpegInstance.loaded) {
    return Promise.resolve(ffmpegInstance);
  }
  if (loadPromise) return loadPromise;

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

// Extension de sortie (ffmpeg déduit le format depuis l'extension)
const getOutputExt = (format: FileType): string => {
  const ext = format.toLowerCase();
  return ext === "tiff" ? "tif" : ext;
};

// MIME types corrects
const MIME_TYPES: Record<string, string> = {
  // audio
  flac: "audio/flac",
  wav: "audio/wav",
  mp3: "audio/mpeg",
  aac: "audio/aac",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
  // image
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  bmp: "image/bmp",
  tif: "image/tiff",
  webp: "image/webp",
  // video
  mp4: "video/mp4",
  webm: "video/webm",
  avi: "video/x-msvideo",
  mov: "video/quicktime",
  mkv: "video/x-matroska",
};

// Arguments ffmpeg par type / format
const getFFmpegArgs = (
  type: ConversionType,
  outputExt: string,
  input: string,
  output: string,
): string[] => {
  switch (type) {
    case "Music":
      return ["-i", input, "-vn", output]; // -vn : ignore la pochette d'album

    case "Image":
      if (outputExt === "gif") {
        // Une image fixe ou animée vers GIF
        return [
          "-i",
          input,
          "-vf",
          "split[a][b];[a]palettegen[p];[b][p]paletteuse",
          output,
        ];
      }
      if (outputExt === "jpg") {
        return ["-i", input, "-q:v", "2", output]; // qualité élevée
      }
      return ["-i", input, output];

    case "Video":
      if (outputExt === "webm") {
        return [
          "-i",
          input,
          "-c:v",
          "libvpx",
          "-b:v",
          "1M",
          "-c:a",
          "libvorbis",
          output,
        ];
      }
      if (outputExt === "mp4" || outputExt === "mov" || outputExt === "mkv") {
        return [
          "-i",
          input,
          "-c:v",
          "libx264",
          "-preset",
          "ultrafast",
          "-c:a",
          "aac",
          output,
        ];
      }
      return ["-i", input, output];
  }
};

export const convertFile = async (
  file: File,
  conversionType: ConversionType,
  targetFormat: FileType,
  onProgress?: (progress: number) => void,
): Promise<File> => {
  const ffmpeg = await loadFFmpeg();

  const task = async () => {
    const handleProgress = ({ progress }: { progress: number }) => {
      onProgress?.(Math.round(progress * 100));
    };
    ffmpeg.on("progress", handleProgress);

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const inputExt = file.name.split(".").pop() || "bin";
    const outputExt = getOutputExt(targetFormat);

    const internalInputName = `input_${uniqueId}.${inputExt}`;
    const internalOutputName = `output_${uniqueId}.${outputExt}`;

    const baseName =
      file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const userOutputFileName = `${baseName}.${outputExt}`;
    const mime = MIME_TYPES[outputExt] ?? "application/octet-stream";

    try {
      await ffmpeg.writeFile(internalInputName, await fetchFile(file));

      const args = getFFmpegArgs(
        conversionType,
        outputExt,
        internalInputName,
        internalOutputName,
      );
      const exitCode = await ffmpeg.exec(args);
      if (exitCode !== 0) {
        throw new Error(`ffmpeg a échoué (code ${exitCode})`);
      }

      const data = (await ffmpeg.readFile(internalOutputName)) as Uint8Array;
      const standardBuffer = data.buffer.slice(
        data.byteOffset,
        data.byteOffset + data.byteLength,
      ) as ArrayBuffer;

      return new File([standardBuffer], userOutputFileName, { type: mime });
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
