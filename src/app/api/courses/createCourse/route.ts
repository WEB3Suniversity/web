// app/api/courses/createCourse/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const courseData = await request.json();
    const db = await connectToDb();

    const result = await db.collection("courses").insertOne({
      ...courseData,
      status: "pending",
      createdAt: new Date(),
    });
    console.log(result, "result-result");

    return NextResponse.json({
      code: 200,
      data: {
        courseId: result.insertedId,
      },
      message: "课程创建成功",
    });
  } catch (error) {
    return NextResponse.json({
      code: 500,
      data: null,
      message: error.message || "创建课程失败",
    });
  }
}
