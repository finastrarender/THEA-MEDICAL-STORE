import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
import { resolvePageForRequest } from "./src/lib/content/pages";

async function testResolve() {
  Object.assign(process.env, { NODE_ENV: "production" }); // Force production check
  console.log("Testing resolvePageForRequest('product-detail')...");
  try {
    const page = await resolvePageForRequest("product-detail");
    if (!page) {
      console.log("RESULT: NULL (Would cause 404)");
    } else {
      console.log("RESULT: SUCCESS");
      console.log("Title:", page.title);
      console.log("Sections count:", page.effectiveSections.length);
    }
  } catch (e) {
    console.log("RESULT: CRASH!");
    console.error(e);
  }
}

testResolve().catch(console.error);
