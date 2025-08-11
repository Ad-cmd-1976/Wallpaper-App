import dotenv from "dotenv";
import mongoose from "mongoose";
import ImageModel from "../models/image.model.js"; // adjust path if needed

// Load env vars from backend/.env
dotenv.config({ path: "./.env" });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ Connected to MongoDB");

    // Example migration: add previewUrl if missing
    const images = await ImageModel.find({ previewUrl: { $exists: false } });

    for (const img of images) {
      img.previewUrl = img.imageUrl + "?w=400&h=400&fit=crop";
      await img.save();
    }

    console.log(`Updated ${images.length} images`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

run();
