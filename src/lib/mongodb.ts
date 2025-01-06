import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let db: Db;

const uri = process.env.NEXT_PUBLIC_DATABASE_URL || ""; // Load the DATABASE_URL from .env
console.log("MONGO_URI:", process.env.NEXT_PUBLIC_DATABASE_URL, uri, "uri-uri");
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
    db = client.db("mydb"); // Use the database specified in the connection string
  }
  return db;
}
