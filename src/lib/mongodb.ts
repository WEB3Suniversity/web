import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let db: Db;

const uri =
  process.env.DATABASE_URL ||
  "mongodb+srv://lijinhai255:ADeQx1Hyj8JRDZtF@cluster0.m2ayv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Load the DATABASE_URL from .env
console.log("MONGO_URI:", process.env.MONGO_URI, uri, "uri-uri");
if (!uri) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env"
  );
}

export async function connectToDb(): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(); // Use the database specified in the connection string
  }
  return db;
}
