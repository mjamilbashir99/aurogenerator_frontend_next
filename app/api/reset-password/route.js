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

  // Generate Reset Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the Reset Token
  const resetPasswordExpiry = crypto.createHash("sha256").update(resetToken).digest("hex");

  // TODO: Store `resetToken` and `resetPasswordExpiry` in the database

  return NextResponse.json({ message: "Reset token generated" });
}
