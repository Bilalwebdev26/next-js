import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};

async function dbConnection(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to DB");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("DB from db connect : ", db);
    //connection.isConnected = db.connections[0].readyState;
    console.log("DB connection SUccessfully");
  } catch (error) {
    console.log("DB connection Failed : ", error);
    process.exit(1);
  }
}

export default dbConnection;
