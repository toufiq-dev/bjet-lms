import multer from "multer";
import path from "path";
import fs from "fs";

// Define the upload directory
const uploadDirectory = path.join(__dirname, "../../uploads");

// Check if the directory exists, and create it if not
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

export const upload = multer({ storage });
