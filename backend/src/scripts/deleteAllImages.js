import cloudinary from "cloudinary";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ImageModel from "../models/image.model.js"; // adjust path to your Image model

dotenv.config();

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

async function deleteAllCloudinaryImages() {
  try {
    let nextCursor = null;
    do {
      const result = await cloudinary.v2.api.resources({
        type: "upload",
        max_results: 500,
        next_cursor: nextCursor
      });

      for (const resource of result.resources) {
        await cloudinary.v2.uploader.destroy(resource.public_id);
        console.log(`🗑️ Deleted from Cloudinary: ${resource.public_id}`);
      }

      nextCursor = result.next_cursor;
    } while (nextCursor);

    console.log("✅ All images deleted from Cloudinary");
  } catch (error) {
    console.error("❌ Error deleting from Cloudinary:", error);
  }
}

async function deleteAllFromDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    await ImageModel.deleteMany({});
    console.log("✅ All image metadata deleted from MongoDB");
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error deleting from MongoDB:", error);
  }
}

async function runCleanup() {
  console.log("🚀 Starting cleanup...");
  await deleteAllCloudinaryImages();
  await deleteAllFromDB();
  console.log("🎉 Cleanup complete!");
  process.exit(0);
}

runCleanup();
