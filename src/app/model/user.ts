import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  isAcceptMessage: boolean;
  messages: Message[]; //user ke andar message honge
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Username is required."],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Email is required."],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid Email."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: false,
  },
  messages: [MessageSchema],
});

const userModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);
export default userModel;
