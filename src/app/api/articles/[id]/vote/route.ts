import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
type Props = {
  params: Promise<{
    id: string;
  }>;
};
export async function POST(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params; // Get the article ID
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const { type } = await req.json(); // Get the vote type (for/against)
    if (!type) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    if (!id || !type) {
      return NextResponse.json(
        { error: "Invalid request parameters." },
        { status: 400 }
      );
    }

    const db = await connectToDb();
    const articlesCollection = db.collection("articles");

    // Fetch the article
    const article = await articlesCollection.findOne({ _id: new ObjectId(id) });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found." },
        { status: 404 }
      );
    }

    // Update the votes and status
    let update: {
      votes_for?: number;
      votes_against?: number;
      status?: string;
    } = {};
    if (type === "for") {
      update = { votes_for: (article.votes_for || 0) + 1 };
    } else if (type === "against") {
      update = { votes_against: (article.votes_against || 0) + 1 };
    } else {
      return NextResponse.json(
        { error: "Invalid vote type." },
        { status: 400 }
      );
    }

    // Modify the status based on votes
    const updatedVotesFor = update.votes_for || article.votes_for;
    const updatedVotesAgainst = update.votes_against || article.votes_against;

    let newStatus = article.status || "Pending";
    if (updatedVotesFor > updatedVotesAgainst) {
      newStatus = "Approved";
    } else if (updatedVotesFor < updatedVotesAgainst) {
      newStatus = "Rejected";
    } else {
      newStatus = "Pending";
    }
    update.status = newStatus;

    // Update the article in the database
    await articlesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    return NextResponse.json({ ...article, ...update });
  } catch (error) {
    console.error("Error updating votes:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
