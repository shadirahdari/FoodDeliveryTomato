import foodModel from "../models/foodModel.js";

export const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!image) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const newFood = new foodModel({
      name,
      description,
      price: Number(price),
      category,
      image
    });

    await newFood.save();
    res.status(201).json({ success: true, message: "Food item added successfully" });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ success: false, message: "Error adding food item" });
  }
};

export const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find();
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error listing food:", error);
    res.status(500).json({ success: false, message: "Error fetching food items" });
  }
};

export const removeFood = async (req, res) => {
  try {
    const { id } = req.params;
    await foodModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Food item removed successfully" });
  } catch (error) {
    console.error("Error removing food:", error);
    res.status(500).json({ success: false, message: "Error removing food item" });
  }
}; 