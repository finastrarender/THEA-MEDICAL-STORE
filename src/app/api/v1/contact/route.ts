import { z } from "zod";
import { Resend } from "resend";
import { jsonData, jsonError } from "@/lib/api-response";
import { connectMongo } from "@/lib/mongoose";
import ContactLead from "@/models/ContactLead";
import { env } from "@/env";
import { ValidationRules } from "@/lib/validation";

const bodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, ValidationRules.name.required)
    .min(2, ValidationRules.name.min)
    .max(50, ValidationRules.name.max)
    .regex(/^[A-Za-z\s]+$/, ValidationRules.name.pattern),
  email: z
    .string()
    .trim()
    .min(1, ValidationRules.email.required)
    .email(ValidationRules.email.pattern)
    .max(ValidationRules.email.max, ValidationRules.email.pattern),
  phone: z
    .string()
    .trim()
    .min(1, ValidationRules.phone.required)
    .refine((value) => /^\+?[0-9]+$/.test(value) && !value.slice(1).includes("+"), {
      message: ValidationRules.phone.pattern,
    })
    .refine((value) => {
      const digits = value.replace(/^\+/, "");
      return digits.length >= 8 && digits.length <= 15;
    }, ValidationRules.phone.digits)
    .regex(ValidationRules.phone.regex, ValidationRules.phone.invalid),
  company: z
    .string()
    .trim()
    .min(1, ValidationRules.facility.required)
    .max(150, ValidationRules.facility.max)
    .regex(ValidationRules.facility.regex, ValidationRules.facility.pattern),
  inquiryType: z
    .string()
    .trim()
    .min(1, ValidationRules.service.required)
    .max(200, ValidationRules.service.required),
  sourcePage: z.enum(["home", "about", "contact"]).optional().default("contact"),
  message: z
    .string()
    .trim()
    .min(1, ValidationRules.message.required)
    .min(10, ValidationRules.message.min)
    .max(1000, ValidationRules.message.max),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("bad_request", "Invalid JSON", 400);
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    const firstMessage = parsed.error.issues[0]?.message || "Invalid payload";
    return jsonError("validation_error", firstMessage, 422, parsed.error.flatten());
  }

  await connectMongo();
  await ContactLead.create({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    company: parsed.data.company,
    inquiryType: parsed.data.inquiryType,
    sourcePage: parsed.data.sourcePage,
    message: parsed.data.message,
  });

  if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL) {
    try {
      const resend = new Resend(env.RESEND_API_KEY);
      const from =
        process.env.CONTACT_FROM_EMAIL?.trim() || "OWTC Contact <onboarding@resend.dev>";
      await resend.emails.send({
        from,
        to: env.CONTACT_TO_EMAIL,
        subject: `Website contact from ${parsed.data.name}`,
        html: `
          <p><strong>From:</strong> ${parsed.data.name} &lt;${parsed.data.email}&gt;</p>
          <p><strong>Phone:</strong> ${parsed.data.phone || "-"}</p>
          <p><strong>Company:</strong> ${parsed.data.company || "-"}</p>
          <p><strong>Inquiry Type:</strong> ${parsed.data.inquiryType || "-"}</p>
          <p>${parsed.data.message.replace(/</g, "&lt;")}</p>
        `,
      });
    } catch (e) {
      console.error("Resend error", e);
    }
  }

  return jsonData({ received: true });
}
