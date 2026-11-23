export const CONVERSTION_TYPES = {
  Music: ["Flac", "Wav", "Mp3", "Aac", "Ogg", "M4a"],
  Image: ["Jpg", "Png", "Gif", "Bmp", "Tiff", "Webp"],
  Video: ["Mp4", "Webm", "Avi", "Mov", "Mkv"],
} as const;

export type ConversionType = keyof typeof CONVERSTION_TYPES;
export type FileType = (typeof CONVERSTION_TYPES)[ConversionType][number];

export const CONVERSION_TYPE_LIST = Object.keys(
  CONVERSTION_TYPES,
) as ConversionType[];
