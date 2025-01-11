import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectToDb();
    const articlesCollection = db.collection("articles");

    const articles = await articlesCollection.find({}).toArray();
    return NextResponse.json(articles);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to fetch articles", error: (error as Error).message },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const db = await connectToDb();
    const body = await request.json(); // Parse request body

    const articlesCollection = db.collection("articles");

    const newArticle = {
      ...body,
      created_at: new Date(), // Add a timestamp for creation
    };

    // Insert the new article
    const result = await articlesCollection.insertOne(newArticle);

    // Respond with the newly created article's ID
    return NextResponse.json({
      message: "Article created successfully!",
      data: { ...newArticle, _id: result.insertedId },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to create article", error: (error as Error).message },
      { status: 500 }
    );
  }
}
