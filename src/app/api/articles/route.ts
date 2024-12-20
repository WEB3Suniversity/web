import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl; // 获取 URL 查询参数
    const id = searchParams.get("id"); // 获取 id 查询参数

    const db = await connectToDb();
    const articlesCollection = db.collection("articles");

    // 如果传入了 id 参数，获取单篇文章
    if (id) {
      const article = await articlesCollection.findOne({
        _id: new ObjectId(id),
      });

      // 如果找不到文章，返回 404 错误
      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      // 返回找到的文章
      return NextResponse.json(article);
    }

    // 如果没有传入 id 参数，返回所有文章
    const articles = await articlesCollection.find({}).toArray();
    return NextResponse.json(articles);
  } catch (error: unknown) {
    console.error("Error fetching articles:", error);
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
