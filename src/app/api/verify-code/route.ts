import userModel from "@/app/model/user";
import dbConnection from "@/lib/dbConnect";
import { z } from "zod";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await userModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 500 }
      );
    }
    const isValidCode = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isValidCode && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { success: true, message: "User verified SuccessFully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        { success: false, message: "Code is expired" },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Code is Incorrect" },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
