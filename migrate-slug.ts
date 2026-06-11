import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
import mongoose from "mongoose";

// Minimal Page model
const Page = mongoose.models.Page || mongoose.model("Page", new mongoose.Schema({
  slug: String,
  title: String,
  status: String
}));

async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("No MONGODB_URI");
  
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
  
  const result = await Page.updateOne(
    { slug: "pharmaceutical-medicines" },
    { $set: { slug: "product-detail", title: "Product Detail" } }
  );
  
  if (result.matchedCount > 0) {
    console.log("MIGRATION SUCCESS: pharmaceutical-medicines -> product-detail");
  } else {
    console.log("MIGRATION FAILED: Slug pharmaceutical-medicines not found.");
  }
  
  await mongoose.disconnect();
}

migrate().catch(console.error);
