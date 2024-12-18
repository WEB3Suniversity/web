// app/api/courses/getAllCourses/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST() {
  try {
    const { db } = await connectToDatabase();
    const courses = await db.collection("courses").find({}).toArray();
    
    return NextResponse.json({
      code: 200,
      data: {
        courses: courses[0]?.courses || []
      },
      message: "获取课程列表成功"
    });
  } catch (error) {
    console.error("获取课程列表失败:", error);
    return NextResponse.json({
      code: 500,
      data: null,
      message: error.message || "获取课程列表失败"
    });
  }
}