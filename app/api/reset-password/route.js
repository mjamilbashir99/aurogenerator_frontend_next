import { NextResponse } from "next/server";
import Connection from "../../dbconfig/dbconfig";
import User from "../../../models/page";
import crypto from "crypto";

export async function POST(request) {
  await Connection();
  const { email } = await request.json();

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return NextResponse.json(
      { message: "Email does not exist" },
      { status: 400 }
    );
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(20).toString("hex"); // Fixed typo
  const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Save the hashed token and expiry time in the database (Assuming your schema supports it)
  existingUser.resetPasswordToken = hashedResetToken;
  existingUser.resetPasswordExpiry = Date.now() + 3600000; // Token expires in 1 hour
  await existingUser.save();

  // Send reset link (Example: You'd need to implement an actual email service)
  return NextResponse.json({
    message: "Password reset link sent to your email",
    resetToken, // In real applications, send this via email
  });
}
