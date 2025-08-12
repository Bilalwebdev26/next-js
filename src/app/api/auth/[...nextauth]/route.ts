import NextAuth from "next-auth/next";
import { authOptions } from "./options";

const handle = NextAuth(authOptions); //handler

export { handle as GET, handle as POST };
