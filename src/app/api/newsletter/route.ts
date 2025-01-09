import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Newsletter } from "@/lib/models/newsletter";
import { Resend } from "resend";

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

    // Send welcome email
    await resend.emails.send({
      from: "Pngly <hello@yourdomain.com>",
      to: email,
      subject: "Welcome to Pngly Newsletter!",
      html: `
        <h2>Welcome to Pngly Newsletter!</h2>
        <p>Thank you for subscribing to our newsletter. We'll keep you updated with the latest resources and news.</p>
        <p>Best regards,<br>The Pngly Team</p>
      `,
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
