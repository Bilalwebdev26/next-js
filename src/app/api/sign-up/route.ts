import dbConnection from "@/lib/dbConnect";
import userModel from "../../model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(req: Request) {
  await dbConnection();
  try {
    const { username, email, password } = await req.json();
    const existingUserVerifiedByUsername = await userModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "User name is already taken." },
        { status: 400 }
      );
    }
    const existingUserByEmail = await userModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { message: "User already exist with this email", success: false },
          { status: 400 }
        );
      } else {
        const hashedPass = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPass;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
      // Todo
    } else {
      const hashedPass = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newuser = new userModel({
        username,
        email,
        password: hashedPass,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newuser.save();
    }
    //send verification email
    const emailRes = await sendVerificationEmail(email, username, verifyCode);
    console.log("Email Res : ", emailRes);
    if (!emailRes.success) {
      return Response.json(
        { success: false, message: emailRes.message },
        { status: 500 }
      );
    }
    return Response.json(
      { success: true, message: "User Register SuccessFully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registering User : ", error);
    return Response.json(
      {
        success: false,
        message: "Error registering User",
      },
      {
        status: 500,
      }
    );
  }
}
