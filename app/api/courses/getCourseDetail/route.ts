
// app/api/courses/getCourseDetail/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const { courseId } = await request.json();
    
    if (!ObjectId.isValid(courseId)) {
      return NextResponse.json({
        code: 400,
        data: null,
        message: "无效的课程ID"
      });
    }

    const { db } = await connectToDatabase();
    const course = await db.collection("courses").findOne({
      _id: new ObjectId(courseId)
    });

    if (!course) {
      return NextResponse.json({
        code: 404,
        data: null,
        message: "课程不存在"
      });
    }

    return NextResponse.json({
      code: 200,
      data: { course },
      message: "获取课程详情成功"
    });
  } catch (error) {
    return NextResponse.json({
      code: 500,
      data: null,
      message: error.message || "获取课程详情失败"
    });
  }
}
