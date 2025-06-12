import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";

const food_list = [
  {
    name: "Greec Salad",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 14,
    image: "1747866230820-food_1.png",
    category: "Salad"
  },
  {
    name: "Clover Salad",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 20,
    image: "1747866291191-food_3.png",
    category: "Salad"
  }
];

const MONGO_URI = "mongodb://localhost:27017/food-delivery";

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if food items already exist
    const existingFoods = await foodModel.find();
    if (existingFoods.length > 0) {
      console.log("Food items already exist in database");
      process.exit(0);
    }

    // Seed food items
    await foodModel.insertMany(food_list);
    console.log("✅ Food items seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding food items:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDB();
