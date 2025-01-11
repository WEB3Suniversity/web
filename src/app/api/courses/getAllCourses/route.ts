import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectToDb();
    const articlesCollection = db.collection("courses");

    const articles = await articlesCollection.find({}).toArray();
    console.log(articles, "articles-articles");
    return NextResponse.json(articles);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to fetch articles", error: (error as Error).message },
      { status: 500 }
    );
  }
}
