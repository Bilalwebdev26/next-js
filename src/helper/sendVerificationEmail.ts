import { resend } from "@/lib/resend";
import verificationEmail from "../../emails/verificationEmail";
import { apiResponse } from "@/app/types/apiResponse";
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<apiResponse> {
  try {
    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:email,
        subject:"Verification Code Course",
        react:verificationEmail({username,otp:verifyCode})
    })
    return { success: true, message: "Verification email send successfully" };
  } catch (emailError) {
    console.error("Error sending verification Email : ", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
