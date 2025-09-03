// compressImages.js
import imageCompression from "browser-image-compression";

/**
 * Compress images while maintaining high quality.
 * @param {File[]} files - Array of File objects (from input[type=file])
 * @param {Object} [options] - Optional compression settings
 * @returns {Promise<File[]>} - Compressed File objects
 */
export async function compressImages(files, options = {}) {
  const defaultOptions = {
    maxSizeMB: 1.5,           // target max size per file
    maxWidthOrHeight: 2560,   // large enough for HD+ displays
    initialQuality: 0.9,      // 90% quality for near-lossless
    useWebWorker: true
  };

  const settings = { ...defaultOptions, ...options };
  const compressedFiles = [];

  for (const file of files) {
    try {
      const compressedFile = await imageCompression(file, settings);
      compressedFiles.push(compressedFile);
    } catch (error) {
      console.error(`Error compressing ${file.name}:`, error);
      compressedFiles.push(file); // fallback to original
    }
  }

  return compressedFiles;
}
