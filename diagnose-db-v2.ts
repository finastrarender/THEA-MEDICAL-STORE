import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
import mongoose from "mongoose";

// Minimal Page model for diagnosis
const sectionSchema = new mongoose.Schema({
  id: String,
  type: String,
  order: Number,
  data: mongoose.Schema.Types.Mixed
}, { _id: false });

const Page = mongoose.models.Page || mongoose.model("Page", new mongoose.Schema({
  slug: String,
  status: String,
  sections: [sectionSchema],
  publishedSections: [sectionSchema]
}));

async function diagnose() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("No MONGODB_URI");
  
  await mongoose.connect(uri);
  console.log("--- DB DIAGNOSIS ---");
  
  const pages = await Page.find({}, { slug: 1, status: 1 });
  console.log("All pages:", JSON.stringify(pages, null, 2));
  
  const page = await Page.findOne({ slug: "product-detail" });
  if (!page) {
    console.log("product-detail NOT FOUND");
  } else {
    console.log("product-detail FOUND");
    console.log("Status:", page.status);
    
    const catalog = page.sections.find(s => s.type === "servicesProductCatalog" || s.type === "servicesproductcatalog");
    const pubCatalog = page.publishedSections.find(s => s.type === "servicesProductCatalog" || s.type === "servicesproductcatalog");
    
    if (catalog) {
       console.log("Draft Products (first 1):", JSON.stringify(catalog.data.products?.slice(0, 1), null, 2));
    }
    if (pubCatalog) {
       console.log("Published Products (first 1):", JSON.stringify(pubCatalog.data.products?.slice(0, 1), null, 2));
    }
  }
  
  await mongoose.disconnect();
}

diagnose().catch(console.error);
