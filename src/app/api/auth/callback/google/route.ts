import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { User } from "@/lib/models/user";
import { connectDB } from "@/lib/db";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

const createOAuthClient = (origin: string) => {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${origin}/api/auth/callback/google`
  );
};

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const oauth2Client = createOAuthClient(origin);

    const { tokens } = await oauth2Client.getToken(code);
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("No payload");
    }

    const { email, name, sub: googleId } = payload;

    await connectDB();
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        googleId,
        password: Math.random().toString(36),
        isVerified: true,
      });
    }

    const token = sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.redirect(
      new URL("/signin?error=google_auth_failed", request.url)
    );
  }
}
