import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImage = (imagePath) => {
  if (!imagePath) return;

  // We expect imagePath to be like "/uploads/1720516749000-random.png"
  // Clean up any leading slash
  const relativePath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  
  // Only delete if it points to the local uploads directory
  if (!relativePath.startsWith("uploads/")) {
    return;
  }

  // Resolve to absolute path on disk: server/uploads/...
  const absolutePath = path.join(__dirname, "..", relativePath);

  fs.unlink(absolutePath, (err) => {
    if (err) {
      // If the file does not exist, that's fine
      if (err.code !== "ENOENT") {
        console.error(`Error deleting image at ${absolutePath}:`, err);
      }
    } else {
      console.log(`Successfully deleted image at ${absolutePath}`);
    }
  });
};

export default deleteImage;
