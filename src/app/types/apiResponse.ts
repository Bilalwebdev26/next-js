import { Message } from "../model/user";
export interface apiResponse{
    success:boolean;
    message:string,
    isAcceptingMessages?:boolean;
    messages?:Array<Message>
}