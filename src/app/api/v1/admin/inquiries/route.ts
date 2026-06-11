import { auth } from "@/auth";
import { jsonData, jsonError } from "@/lib/api-response";
import { connectMongo } from "@/lib/mongoose";
import ContactLead from "@/models/ContactLead";

const SOURCE_PAGES = new Set(["home", "about", "contact"]);

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return jsonError("unauthorized", "Sign in required", 401);
  }

  const { searchParams } = new URL(request.url);
  const sourcePage = searchParams.get("sourcePage")?.trim();
  const filter =
    sourcePage && SOURCE_PAGES.has(sourcePage)
      ? sourcePage === "home"
        ? { $or: [{ sourcePage }, { sourcePage: { $exists: false } }] }
        : { sourcePage }
      : {};

  await connectMongo();
  const inquiries = await ContactLead.find(filter)
    .sort({ createdAt: -1 })
    .limit(25)
    .lean();

  return jsonData(
    inquiries.map((inquiry) => ({
      id: String(inquiry._id),
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone ?? "",
      company: inquiry.company ?? "",
      inquiryType: inquiry.inquiryType ?? "",
      sourcePage: inquiry.sourcePage ?? "home",
      message: inquiry.message,
      createdAt: inquiry.createdAt ? new Date(inquiry.createdAt).toISOString() : "",
    })),
  );
}
