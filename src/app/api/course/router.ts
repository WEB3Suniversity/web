import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongodb";

// 获取所有课程
export async function GET() {
  try {
    const db = await connectToDb();
    const coursesCollection = db.collection("courses");

    const courses = await coursesCollection.find({}).toArray();
    return NextResponse.json(courses);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to fetch courses", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// 创建新课程
export async function POST(request: NextRequest) {
  try {
    const db = await connectToDb();
    const body = await request.json(); // Parse request body

    const coursesCollection = db.collection("courses");

    // 校验必填字段
    if (!body.title || !body.description || !body.difficulty || !body.price) {
      return NextResponse.json(
        {
          message:
            "Missing required fields (title, description, difficulty, price)",
        },
        { status: 400 }
      );
    }

    const newCourse = {
      ...body,
      created_at: new Date(), // Add a timestamp for creation
      stats: {
        modules: body.stats?.modules || 1, // Default to 1 module if not provided
        duration: body.stats?.duration || "0 Hours", // Default to "0 Hours" if not provided
        rewards: body.stats?.rewards || 0, // Default to 0 rewards if not provided
      },
    };

    // Insert the new course into the courses collection
    const result = await coursesCollection.insertOne(newCourse);

    return NextResponse.json({
      message: "Course created successfully!",
      data: { ...newCourse, _id: result.insertedId },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to create course", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// 更新课程信息
export async function PUT(request: NextRequest) {
  try {
    const db = await connectToDb();
    const { course_id, updates } = await request.json(); // Parse request body

    const coursesCollection = db.collection("courses");

    if (!course_id) {
      return NextResponse.json(
        { message: "Course ID is required" },
        { status: 400 }
      );
    }

    // Update course details
    const result = await coursesCollection.updateOne(
      { id: course_id },
      {
        $set: updates, // Set the fields to update
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No course found with the provided ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Course updated successfully",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to update course", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// 删除课程
export async function DELETE(request: NextRequest) {
  try {
    const db = await connectToDb();
    const { course_id } = await request.json(); // Parse request body

    const coursesCollection = db.collection("courses");

    if (!course_id) {
      return NextResponse.json(
        { message: "Course ID is required" },
        { status: 400 }
      );
    }

    // Delete course
    const result = await coursesCollection.deleteOne({ id: course_id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "No course found with the provided ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Course deleted successfully",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to delete course", error: (error as Error).message },
      { status: 500 }
    );
  }
}
