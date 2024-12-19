import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectToDb();
    const articlesCollection = db.collection("articles");

    const articles = await articlesCollection.find({}).toArray();
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch articles", error: error.message },
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
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create article", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await connectToDb();
    const body = await request.json();
    const { article_id, ...updateFields } = body;

    const articlesCollection = db.collection("articles");

    const result = await articlesCollection.updateOne(
      { article_id },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No articles were updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Article updated successfully!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update article", error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const db = await connectToDb();
    const { article_id } = await request.json();

    const articlesCollection = db.collection("articles");

    const result = await articlesCollection.deleteOne({ article_id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "No articles were deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Article deleted successfully!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete article", error: error.message },
      { status: 500 }
    );
  }
}
