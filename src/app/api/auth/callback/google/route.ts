import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { User } from "@/lib/models/user";
import { connectDB } from "@/lib/db";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const createOAuthClient = (redirectUri: string) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth credentials are not configured");
  }

  return new OAuth2Client({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: redirectUri,
  });
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const baseUrl = url.origin;

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/signin?error=no_code`);
    }

    const redirectUri = `${baseUrl}/api/auth/callback/google`;
    const oauth2Client = createOAuthClient(redirectUri);

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Invalid token payload");
    }

    const { email, name, sub: googleId } = payload;

    await connectDB();
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        googleId,
        password: Math.random().toString(36).slice(-8),
        isVerified: true,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
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

    return NextResponse.redirect(`${baseUrl}/`);
  } catch (error) {
    console.error("Google Auth Error:", error);
    const baseUrl = new URL(request.url).origin;
    return NextResponse.redirect(`${baseUrl}/signin?error=google_auth_failed`);
  }
}
