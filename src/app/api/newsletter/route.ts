import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Newsletter } from "@/lib/models/newsletter";
import { Resend } from "resend";
import { render } from "@react-email/render";
import NewsletterWelcomeEmail from "@/emails/NewsletterWelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 400 }
      );
    }

    // Save to database
    await Newsletter.create({ email });

    const emailHtml = render(
      NewsletterWelcomeEmail({
        email,
      })
    );

    // Send welcome email
    await resend.emails.send({
      from: "RawPng <hello@rawpng.com>",
      to: email,
      subject: "Welcome to RawPng Newsletter! 🎨",
      html: await emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter!",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
