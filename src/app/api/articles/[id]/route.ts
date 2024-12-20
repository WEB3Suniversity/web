import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type Props = {
  params: Promise<{
    id: string;
  }>;
};
export async function GET(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const db = await connectToDb();
    const article = await db
      .collection("articles")
      .findOne({ _id: new ObjectId(id) });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    // Extract the `id` from params
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
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
export async function PUT(req: NextRequest, { params }: Props) {
  try {
    // Extract the ID from params
    const { id } = await params;

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
