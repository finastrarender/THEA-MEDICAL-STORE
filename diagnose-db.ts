import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
import mongoose from "mongoose";
import Page from "./src/models/Page.js";

type DiagnosticSection = {
  type?: string;
  data?: {
    products?: unknown[];
  };
};

async function diagnose() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("No MONGODB_URI");
  
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
  
  const page = await Page.findOne({ slug: "product-detail" });
  if (!page) {
    console.log("PAGE NOT FOUND: product-detail");
  } else {
    console.log("PAGE FOUND: product-detail");
    console.log("Status:", page.status);
    console.log("PublishedAt:", page.publishedAt);
    console.log("Draft Sections count:", page.sections.length);
    console.log("Published Sections count:", page.publishedSections.length);

    const isCatalogSection = (s: DiagnosticSection) => s.type === "servicesProductCatalog";

    const catalogDraft = (page.sections as DiagnosticSection[]).find(isCatalogSection);
    const catalogPub = (page.publishedSections as DiagnosticSection[]).find(isCatalogSection);
    
    if (catalogDraft) {
      console.log("--- Catalog Draft (first 2 products) ---");
      console.log(JSON.stringify(catalogDraft.data?.products?.slice(0, 2), null, 2));
    }
    
    if (catalogPub) {
      console.log("--- Catalog Published (first 2 products) ---");
      console.log(JSON.stringify(catalogPub.data?.products?.slice(0, 2), null, 2));
    }
  }
  
  await mongoose.disconnect();
}

diagnose().catch(console.error);
