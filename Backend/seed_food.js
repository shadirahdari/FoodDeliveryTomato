import mongoose from "mongoose";
import dotenv from "dotenv";
import { food_list } from "./path-to-food-data.js"; // adjust path as needed
import FoodModel from "./models/foodModel.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_ATLAS_URL; // Make sure it's set in .env

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB Atlas");

    await FoodModel.deleteMany(); // optional: clear old data
    await FoodModel.insertMany(food_list);
    console.log("🍽️ Food data seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
