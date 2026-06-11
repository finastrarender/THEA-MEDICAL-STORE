import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
import mongoose from "mongoose";

async function migrateLinks() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("No MONGODB_URI");
  
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
  
  const Page = mongoose.models.Page || mongoose.model("Page", new mongoose.Schema({}, { strict: false }));
  
  const pages = await Page.find({});
  console.log(`Found ${pages.length} pages to check.`);
  
  for (const page of pages) {
    let changed = false;
    let content = JSON.stringify(page.toObject());
    
    if (content.includes("pharmaceutical-medicines")) {
      console.log(`Migrating links in page: ${page.slug}`);
      const updatedContent = content.replace(/pharmaceutical-medicines/g, "product-detail");
      const updatedData = JSON.parse(updatedContent);
      
      // We only want to update the fields we care about to avoid _id conflicts
      page.sections = updatedData.sections;
      page.publishedSections = updatedData.publishedSections;
      changed = true;
    }
    
    if (changed) {
      await page.save();
      console.log(`Saved ${page.slug}`);
    }
  }
  
  await mongoose.disconnect();
  console.log("Migration complete.");
}

migrateLinks().catch(console.error);
