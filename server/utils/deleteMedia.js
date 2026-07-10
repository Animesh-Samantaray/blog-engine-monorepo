import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteMedia = (filePath) => {
  if (!filePath) return;

  // Example:
  // /uploads/1720516749000-random.png
  // /uploads/1720516749000-video.mp4

  const relativePath = filePath.startsWith("/")
    ? filePath.slice(1)
    : filePath;

  // Safety check
  if (!relativePath.startsWith("uploads/")) {
    return;
  }

  const absolutePath = path.join(__dirname, "..", relativePath);

  fs.unlink(absolutePath, (err) => {
    if (err) {
      if (err.code !== "ENOENT") {
        console.error(`Error deleting file at ${absolutePath}:`, err);
      }
    } else {
      console.log(`Successfully deleted file: ${absolutePath}`);
    }
  });
};

export default deleteMedia;