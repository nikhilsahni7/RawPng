import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { User } from "@/lib/models/user";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const token = cookies().get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    await connectDB();

    const user = await User.findById(decoded.userId).select("email name");
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ user: null });
  }
}
