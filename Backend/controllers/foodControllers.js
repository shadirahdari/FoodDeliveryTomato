import foodModel from "../models/foodModel.js";
import fs from "fs"; // Added for file removal
import path from "path"; // Added for safe file path joining

export const addFood = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const image_filename = req.file?.filename;
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category || !image_filename) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const food = new foodModel({
      name,
      description,
      price,
      category,
      image: image_filename,
    });

    await food.save();

    res.status(201).json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error("ADD FOOD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error",
      error: error.message,
    });
  }
};

export const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find();
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.error("LIST FOOD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching food list",
      error: error.message,
    });
  }
};

export const removeFood = async (req, res) => {
  try {
    const foodId = req.params.id;

    const deletedFood = await foodModel.findByIdAndDelete(foodId);

    if (!deletedFood) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    // 🔥 Delete the associated image file
    const imagePath = path.join("uploads", deletedFood.image);

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
        // Optional: you can ignore file delete errors, depending on your logic
      } else {
        console.log("Image file deleted:", deletedFood.image);
      }
    });

    res.status(200).json({ success: true, message: "Food item and image deleted successfully" });
  } catch (error) {
    console.error("REMOVE FOOD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting food item",
      error: error.message,
    });
  }
};
