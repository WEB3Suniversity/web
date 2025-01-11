
// app/api/courses/updateCourseStatus/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const { courseId, contractCourseId, status } = await request.json();
    
    if (!ObjectId.isValid(courseId)) {
      return NextResponse.json({
        code: 400,
        data: null,
        message: "无效的课程ID"
      });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("courses").findOneAndUpdate(
      { _id: new ObjectId(courseId) },
      {
        $set: {
          contractCourseId,
          status,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return NextResponse.json({
        code: 404,
        data: null,
        message: "课程不存在"
      });
    }

    return NextResponse.json({
      code: 200,
      data: { course: result.value },
      message: "课程状态更新成功"
    });
  } catch (error) {
    return NextResponse.json({
      code: 500,
      data: null,
      message: error.message || "更新课程状态失败"
    });
  }
}