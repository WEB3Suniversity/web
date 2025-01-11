// app/api/courses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// 获取所有课程
async function getAllCourses() {
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection("courses").findOne({});

    return NextResponse.json({
      code: 200,
      data: {
        courses: doc?.courses || [],
      },
      message: "获取课程列表成功",
    });
  } catch (error) {
    console.error("获取课程列表失败:", error);
    return NextResponse.json({
      code: 500,
      data: null,
      message: error.message || "获取课程列表失败",
    });
  }
}

// // 获取所有课程
// async function getAllCourses() {
//   const { db } = await connectToDatabase();
//   const courses = await db.collection("courses").find({}).toArray();

//   return NextResponse.json({
//     code: 200,
//     data: {
//       courses: courses[0]?.courses || [],
//     },
//     message: "获取课程列表成功",
//   });
// }

// 创建新课程
async function createCourse(courseData: any) {
  // data.courseData 而不是 {courseData} = data
  console.log("Creating course with data:", courseData);

  const { db } = await connectToDatabase();
  const firstDoc = await db.collection("courses").findOne({});

  try {
    const newCourse = {
      id: String(Date.now()),
      title: courseData.title, // 直接使用 courseData 中的字段
      description: courseData.description,
      difficulty: courseData.level, // 注意字段名的映射
      category: courseData.category,
      modules: courseData.modules,
      hours: courseData.hours,
      rewards: courseData.rewards,
      price: courseData.price,
      image: "/path-to-image.jpg",
      tags: [], // 添加默认标签数组
      stats: {}, // 添加默认统计对象
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db
      .collection("courses")
      .updateOne({ _id: firstDoc._id }, { $push: { courses: newCourse } });

    console.log("Update result:", result);

    return NextResponse.json({
      code: 200,
      data: { ...result, courseId: newCourse.id },
      message: "课程创建成功",
    });
  } catch (error) {
    console.error("MongoDB operation error:", error);
    return NextResponse.json({
      code: 500,
      data: null,
      message: error.message || "创建课程失败",
    });
  }
}

// 获取课程详情
async function getCourseDetail(data: any) {
  try {
    const { courseId } = data;
    console.log("🚀 ~ getCourseDetail ~ data:", data);
    console.log("Getting course detail for ID:", courseId);

    const { db } = await connectToDatabase();
    const doc = await db.collection("courses").findOne({
      "courses.id": courseId,
    });

    if (!doc) {
      return NextResponse.json({
        code: 404,
        data: null,
        message: "课程不存在",
      });
    }

    const course = doc.courses.find((c) => c.id === courseId);

    return NextResponse.json({
      code: 200,
      data: { course },
      message: "获取课程详情成功",
    });
  } catch (error) {
    console.error("获取课程详情失败:", error);
    return NextResponse.json({
      code: 500,
      data: null,
      message: error.message || "获取课程详情失败",
    });
  }
}

// 更新课程信息
async function updateCourse(data: any) {
  try {
    const { courseId, updateData } = data;
    console.log("Updating course:", { courseId, updateData });

    if (!courseId) {
      return NextResponse.json({
        code: 400,
        data: null,
        message: "课程ID不能为空",
      });
    }

    const { db } = await connectToDatabase();

    // 构建更新字段，支持更新任何传入的字段
    const updateFields = {};
    Object.keys(updateData).forEach((key) => {
      console.log("🚀 ~ Object.keys ~ key:", key);
      updateFields[`courses.$.${key}`] = updateData[key];
    });

    // 自动添加更新时间
    updateFields["courses.$.updatedAt"] = new Date();

    const result = await db
      .collection("courses")
      .updateOne({ "courses.id": courseId }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json({
        code: 404,
        data: null,
        message: "课程不存在",
      });
    }

    // 获取更新后的课程信息
    const updatedDoc = await db
      .collection("courses")
      .findOne({ "courses.id": courseId });
    const updatedCourse = updatedDoc.courses.find((c) => c.id === courseId);

    return NextResponse.json({
      code: 200,
      data: { course: updatedCourse }, // 返回更新后的完整课程信息
      message: "课程更新成功",
    });
  } catch (error) {
    console.error("更新课程失败:", error);
    return NextResponse.json({
      code: 500,
      data: null,
      message: error.message || "更新课程失败",
    });
  }
}

// 统一的 POST 处理函数
export async function POST(request: NextRequest) {
  try {
    const { action, payload = {} } = await request.json();

    switch (action) {
      case "getAllCourses":
        return getAllCourses();

      case "createCourse":
        return createCourse({ ...payload });

      case "getCourseDetail":
        return getCourseDetail({ ...payload });

      case "updateCourse":
        return updateCourse({ ...payload });

      default:
        return NextResponse.json({
          code: 400,
          data: null,
          message: "未知的函数名称",
        });
    }
  } catch (error) {
    console.error("API错误:", error);
    return NextResponse.json({
      code: 500,
      data: null,
      message: error.message || "操作失败",
    });
  }
}
