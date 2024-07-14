import multer from "multer";
import path from "path";
import fs from "fs/promises";
import config from "../config";

// Define the upload directory and subdirectories
const uploadDirectory = config.uploadDir;
const pdfDirectory = config.pdfDir;
const videoDirectory = config.videoDir;

// Function to create directory if it doesn't exist
const createDirectoryIfNotExists = async (dir: string) => {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
};

// Initialize directories
(async () => {
  await Promise.all([
    createDirectoryIfNotExists(uploadDirectory),
    createDirectoryIfNotExists(pdfDirectory),
    createDirectoryIfNotExists(videoDirectory),
  ]);
})();

// Configure multer for file uploads
const storage = multer.memoryStorage();

export const upload = multer({ storage });

let counter = 0;
const generateUniqueFilename = (originalname: string) => {
  const timestamp = Date.now();
  counter = (counter + 1) % 1000; // Reset to 0 after 999
  return `${timestamp}-${counter.toString().padStart(3, "0")}-${originalname}`;
};

// Helper function to save files asynchronously
export const saveFile = async (
  file: Express.Multer.File,
  directory: string
): Promise<string> => {
  const filename = generateUniqueFilename(file.originalname);
  const filePath = path.join(directory, filename);

  await fs.writeFile(filePath, file.buffer);
  return filePath;
};

// Helper function to save multiple files asynchronously
export const saveMultipleFiles = async (
  files: Express.Multer.File[],
  directory: string
): Promise<{ [key: string]: string }> => {
  const uploadPromises = files.map(async (file) => {
    const filePath = await saveFile(file, directory);
    return [file.originalname, filePath];
  });

  const uploadedFiles = await Promise.all(uploadPromises);
  return Object.fromEntries(uploadedFiles);
};