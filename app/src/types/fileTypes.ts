export const FILE_TYPES = ["Flac", "Wav", "Mp3", "Aac", "Ogg", "m4a"] as const;

export type FileType = (typeof FILE_TYPES)[number];
