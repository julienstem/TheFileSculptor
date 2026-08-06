import { useState, useCallback } from "react";
import JSZip, { type JSZipMetadata } from "jszip";

interface UseZipDownloadOptions {
  /** Optional default name for the downloaded zip file (defaults to 'converted_files.zip') */
  defaultFilename?: string;
}

interface UseZipDownloadReturn {
  downloadZip: (files: File[], customFilename?: string) => Promise<void>;
  isZipping: boolean;
  progress: number; // 0 to 100
  error: Error | null;
}

export const useZipDownload = (
  options: UseZipDownloadOptions = {},
): UseZipDownloadReturn => {
  const [isZipping, setIsZipping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const downloadZip = useCallback(
    async (files: File[], customFilename?: string) => {
      // Filter out null/undefined files
      const validFiles = files.filter(Boolean);

      if (validFiles.length === 0) {
        console.warn("No valid files provided to zip.");
        return;
      }

      setIsZipping(true);
      setProgress(0);
      setError(null);

      try {
        const zip = new JSZip();

        // 1. Add all files to the ZIP instance
        validFiles.forEach((file) => {
          zip.file(file.name, file);
        });

        // 2. Generate the ZIP blob with progress updates
        const zipBlob = await zip.generateAsync(
          { type: "blob" },
          (metadata: JSZipMetadata) => {
            setProgress(Math.round(metadata.percent));
          },
        );

        // 3. Trigger browser download using a temporary anchor tag
        const filename =
          customFilename || options.defaultFilename || "converted_files.zip";
        const downloadUrl = URL.createObjectURL(zipBlob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename.endsWith(".zip")
          ? filename
          : `${filename}.zip`;
        document.body.appendChild(link);
        link.click();

        // Clean up DOM and memory
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        const errorObject =
          err instanceof Error ? err : new Error("Failed to create ZIP file");
        setError(errorObject);
        console.error("ZIP Generation Error:", errorObject);
      } finally {
        setIsZipping(false);
      }
    },
    [options.defaultFilename],
  );

  return {
    downloadZip,
    isZipping,
    progress,
    error,
  };
};
