import express from "express";
import multer from "multer";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const foodRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Image Storage Engine
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage: Storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Make sure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
foodRouter.post("/add", verifyToken, isAdmin, upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.delete("/:id", verifyToken, isAdmin, removeFood);

export default foodRouter; 