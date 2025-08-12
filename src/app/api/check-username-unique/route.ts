import dbConnection from "@/lib/dbConnect";
import userModel from "@/app/model/user";
import {  z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});
export async function GET(request: Request) {
  await dbConnection();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    //validate with zod
    const result = usernameQuerySchema.safeParse(queryParam);
    console.log("Result : ", result);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          message:
            usernameError?.length > 0
              ? usernameError.join(", ")
              : "Inavalid query paramter",
          success: false,
        },
        { status: 400 }
      );
    }
    const{username} = result.data
    const existingVerifiedUser = await userModel.findOne({username,isVerified:true})
    if(existingVerifiedUser){
        return Response.json({message:"Username Already Token",success:false},{status:400})
    }
       return Response.json({message:"Username is Available",success:true},{status:200})
  } catch (error) {
    console.error("Error checking username : ", error);
    return Response.json(
      { success: false, message: "Error checking username" },
      { status: 500 }
    );
  }
}
//check-username-unique