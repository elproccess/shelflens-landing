import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RECIPIENT_EMAIL = "aimensunabara@gmail.com";

type RequestAccessPayload = {
  fullName?: unknown;
  email?: unknown;
  phoneNumber?: unknown;
  businessName?: unknown;
  storeCount?: unknown;
  location?: unknown;
  currentIssue?: unknown;
  message?: unknown;
};

const fieldLabels: Array<[keyof Required<RequestAccessPayload>, string]> = [
  ["fullName", "Full name"],
  ["email", "Email"],
  ["phoneNumber", "Phone number"],
  ["businessName", "Store / business name"],
  ["storeCount", "Number of stores"],
  ["location", "Location / city"],
  ["currentIssue", "Current issue"],
  ["message", "Message / notes"],
];

const requiredFields: Array<keyof Required<RequestAccessPayload>> = [
  "fullName",
  "email",
  "phoneNumber",
  "businessName",
  "storeCount",
  "location",
  "currentIssue",
];

function normalize(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  let payload: RequestAccessPayload;

  try {
    payload = (await request.json()) as RequestAccessPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fields = {
    fullName: normalize(payload.fullName),
    email: normalize(payload.email),
    phoneNumber: normalize(payload.phoneNumber),
    businessName: normalize(payload.businessName),
    storeCount: normalize(payload.storeCount),
    location: normalize(payload.location),
    currentIssue: normalize(payload.currentIssue),
    message: normalize(payload.message),
  };

  const missingField = requiredFields.find((field) => !fields[field]);
  if (missingField) {
    return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
  }

  if (!/^\S+@\S+\.\S+$/.test(fields.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    return NextResponse.json(
      { error: "Request access email is not configured." },
      { status: 500 },
    );
  }

  const textBody = fieldLabels
    .map(([field, label]) => `${label}: ${fields[field] || "Not provided"}`)
    .join("\n");

  const htmlRows = fieldLabels
    .map(
      ([field, label]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #d8dee9;font-weight:700;color:#0f172a;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #d8dee9;color:#334155;">${escapeHtml(fields[field] || "Not provided")}</td>
        </tr>
      `,
    )
    .join("");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: `"ShelfLens" <${gmailUser}>`,
      to: RECIPIENT_EMAIL,
      replyTo: fields.email,
      subject: "New ShelfLens access request",
      text: textBody,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;line-height:1.5;color:#0f172a;">
          <h1 style="font-size:22px;margin:0 0 16px;">New ShelfLens access request</h1>
          <table style="border-collapse:collapse;width:100%;max-width:680px;border:1px solid #d8dee9;">
            <tbody>${htmlRows}</tbody>
          </table>
        </div>
      `,
    });
  } catch (error) {
    console.error("Request access Gmail SMTP failed", error);
    return NextResponse.json({ error: "Unable to send your request right now." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}