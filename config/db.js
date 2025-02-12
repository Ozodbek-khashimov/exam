import {connect} from "mongoose"
import * as dotenv from 'dotenv'
dotenv.config()
const mongodb_url= process.env.MONGODB_URI || 'mongodb+srv://ozodbek:qwer12345@cluster0.kdl5i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export const connectDB = async () => {
  try {
    await connect(mongodb_url);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error);
  }
}; 