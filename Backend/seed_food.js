import mongoose from "mongoose";
import dotenv from 'dotenv';
import foodModel from "./models/foodModel.js";

// Load environment variables
dotenv.config();

const food_list = [
  {
    name: "Greek salad",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 12,
    image: "food_1.png",
    category: "Salad",
    isAvailable: true,
    tags: ["healthy", "vegetarian"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    name: "Veg salad",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 18,
    image: "food_2.png",
    category: "Salad",
    isAvailable: true,
    tags: ["healthy", "vegetarian"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    name: "Clover Salad",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 16,
    image: "food_3.png",
    category: "Salad",
    isAvailable: true,
    tags: ["healthy", "vegetarian"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    name: "Chicken Salad",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 24,
    image: "food_4.png",
    category: "Salad",
    isAvailable: true,
    tags: ["protein", "chicken"],
    spiceLevel: "Medium",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true
  },
  {
    name: "Lasagna Rolls",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 14,
    image: "food_5.png",
    category: "Rolls",
    isAvailable: true,
    tags: ["italian", "pasta"],
    spiceLevel: "Mild",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: "Peri Peri Rolls",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 12,
    image: "food_6.png",
    category: "Rolls",
    isAvailable: true,
    tags: ["spicy", "chicken"],
    spiceLevel: "Hot",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: "Chicken Rolls",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 20,
    image: "food_7.png",
    category: "Rolls",
    isAvailable: true,
    tags: ["chicken", "protein"],
    spiceLevel: "Medium",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: "Veg Rolls",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 15,
    image: "food_8.png",
    category: "Rolls",
    isAvailable: true,
    tags: ["vegetarian", "healthy"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false
  },
  {
    name: "Ripple Ice Cream",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 14,
    image: "food_9.png",
    category: "Deserts",
    isAvailable: true,
    tags: ["sweet", "cold"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true
  },
  {
    name: "Fruit Ice Cream",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 22,
    image: "food_10.png",
    category: "Deserts",
    isAvailable: true,
    tags: ["sweet", "fruit", "cold"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    name: "Jar Ice Cream",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 10,
    image: "food_11.png",
    category: "Deserts",
    isAvailable: true,
    tags: ["sweet", "cold"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true
  },
  {
    name: "Vanilla Ice Cream",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 12,
    image: "food_12.png",
    category: "Deserts",
    isAvailable: true,
    tags: ["sweet", "cold", "classic"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true
  },
  {
    name: "Chicken Sandwich",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 12,
    image: "food_13.png",
    category: "Sandwich",
    isAvailable: true,
    tags: ["chicken", "protein"],
    spiceLevel: "Medium",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: "Vegan Sandwich",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 18,
    image: "food_14.png",
    category: "Sandwich",
    isAvailable: true,
    tags: ["vegan", "healthy"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false
  },
  {
    name: "Grilled Sandwich",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 16,
    image: "food_15.png",
    category: "Sandwich",
    isAvailable: true,
    tags: ["grilled", "hot"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: "Bread Sandwich",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 24,
    image: "food_16.png",
    category: "Sandwich",
    isAvailable: true,
    tags: ["bread", "classic"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: "Cup Cake",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 14,
    image: "food_17.png",
    category: "Cake",
    isAvailable: true,
    tags: ["sweet", "cupcake"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: "Vegan Cake",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 12,
    image: "food_18.png",
    category: "Cake",
    isAvailable: true,
    tags: ["vegan", "sweet"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false
  },
  {
    name: "Butterscotch Cake",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 20,
    image: "food_19.png",
    category: "Cake",
    isAvailable: true,
    tags: ["butterscotch", "sweet"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: "Sliced Cake",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 15,
    image: "food_20.png",
    category: "Cake",
    isAvailable: true,
    tags: ["cake", "sweet"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: "Garlic Mushroom",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 14,
    image: "food_21.png",
    category: "Pure Veg",
    isAvailable: true,
    tags: ["mushroom", "garlic", "vegetarian"],
    spiceLevel: "Medium",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    name: "Fried Cauliflower",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 22,
    image: "food_22.png",
    category: "Pure Veg",
    isAvailable: true,
    tags: ["cauliflower", "fried", "vegetarian"],
    spiceLevel: "Medium",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    name: "Mix Veg Pulao",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 10,
    image: "food_23.png",
    category: "Pure Veg",
    isAvailable: true,
    tags: ["rice", "mixed vegetables", "vegetarian"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    name: "Rice Zucchini",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 12,
    image: "food_24.png",
    category: "Pure Veg",
    isAvailable: true,
    tags: ["rice", "zucchini", "vegetarian"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    name: "Cheese Pasta",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 12,
    image: "food_25.png",
    category: "Pasta",
    isAvailable: true,
    tags: ["pasta", "cheese"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: "Tomato Pasta",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 18,
    image: "food_26.png",
    category: "Pasta",
    isAvailable: true,
    tags: ["pasta", "tomato"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false
  },
  {
    name: "Creamy Pasta",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 16,
    image: "food_27.png",
    category: "Pasta",
    isAvailable: true,
    tags: ["pasta", "creamy"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: "Chicken Pasta",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 24,
    image: "food_28.png",
    category: "Pasta",
    isAvailable: true,
    tags: ["pasta", "chicken"],
    spiceLevel: "Medium",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: "Butter Noodles",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 14,
    image: "food_29.png",
    category: "Noodles",
    isAvailable: true,
    tags: ["noodles", "butter"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: "Veg Noodles",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 12,
    image: "food_30.png",
    category: "Noodles",
    isAvailable: true,
    tags: ["noodles", "vegetarian"],
    spiceLevel: "Medium",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false
  },
  {
    name: "Somen Noodles",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 20,
    image: "food_31.png",
    category: "Noodles",
    isAvailable: true,
    tags: ["noodles", "somen"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false
  },
  {
    name: "Cooked Noodles",
    description: "Food provides essential nutrients for overall health and well-being",
    price: 15,
    image: "food_32.png",
    category: "Noodles",
    isAvailable: true,
    tags: ["noodles", "cooked"],
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false
  }
];

const seedDB = async () => {
  try {
    // Use the MONGO_URI from environment variables
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Check if food items already exist
    const existingFoods = await foodModel.find();
    if (existingFoods.length > 0) {
      console.log(`Found ${existingFoods.length} existing food items. Skipping seed.`);
      console.log("To reseed, delete existing data first.");
      process.exit(0);
    }

    // Seed food items
    await foodModel.insertMany(food_list);
    console.log(`✅ Successfully seeded ${food_list.length} food items to database`);

    // Verify the seeding
    const totalFoods = await foodModel.countDocuments();
    console.log(`📊 Total food items in database: ${totalFoods}`);

  } catch (error) {
    console.error("❌ Error seeding food items:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

seedDB();
