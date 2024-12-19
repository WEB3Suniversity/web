import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the `id` from params
    const { id } = params;
    console.log(id, "id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing article ID in the request" },
        { status: 400 }
      );
    }

    // Connect to the database
    const db = await connectToDb();
    const articlesCollection = db.collection("articles");

    // Convert `id` to ObjectId and delete the document
    const result = await articlesCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "No article found with the given ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Internal server error during deletion" },
      { status: 500 }
    );
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the ID from params
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing article ID in the request" },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { title, author_address, content_hash } = body;

    // Connect to the database
    const db = await connectToDb();
    const articlesCollection = db.collection("articles");

    // Update the article with the given ID
    const result = await articlesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, author_address, content_hash } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "No articles were updated. Article may not exist." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Internal server error during update" },
      { status: 500 }
    );
  }
}
