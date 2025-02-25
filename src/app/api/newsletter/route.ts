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

    // Add subscriber to Resend contacts
    try {
      await resend.contacts.create({
        email: email,
        unsubscribed: false,
        firstName: "Subscriber",
        lastName: "",
        audienceId: "28c3abdc-783b-4a7f-8a63-b8df2d9a620d",
      });
      console.log("Contact added to Resend");
    } catch (contactError) {
      console.error("Failed to add contact to Resend:", contactError);
      console.error("Error details:", JSON.stringify(contactError));
    }

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
