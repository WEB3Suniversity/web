import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongodb";

// 获取所有用户
export async function GET() {
  try {
    const db = await connectToDb();
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();
    return NextResponse.json(users);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to fetch users", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// 创建新用户
export async function POST(request: NextRequest) {
  try {
    const db = await connectToDb();
    const body = await request.json(); // Parse request body

    const usersCollection = db.collection("users");

    // 校验必填字段
    if (
      !body.username ||
      !body.email ||
      !body.password ||
      !body.wallet_address
    ) {
      return NextResponse.json(
        {
          message:
            "Missing required fields (username, email, password, wallet_address)",
        },
        { status: 400 }
      );
    }

    const newUser = {
      ...body,
      created_at: new Date(), // Add a timestamp for creation
      last_login_time: new Date(), // Add initial login time
      total_articles: 0, // Set initial article count
      total_reviews: 0, // Set initial review count
      total_courses: 0, // Set initial course count
      status: "Active", // Default to 'Active' status
      role: "User", // Default role is 'User'
    };

    // Insert the new user into the users collection
    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json({
      message: "User created successfully!",
      data: { ...newUser, _id: result.insertedId },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to create user", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// 更新用户信息
export async function PUT(request: NextRequest) {
  try {
    const db = await connectToDb();
    const { user_id, updates } = await request.json(); // Parse request body

    const usersCollection = db.collection("users");

    if (!user_id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Update user details
    const result = await usersCollection.updateOne(
      { user_id },
      {
        $set: updates, // Set the fields to update
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No user found with the provided ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User updated successfully",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to update user", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// 删除用户
export async function DELETE(request: NextRequest) {
  try {
    const db = await connectToDb();
    const { user_id } = await request.json(); // Parse request body

    const usersCollection = db.collection("users");

    if (!user_id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Delete user
    const result = await usersCollection.deleteOne({ user_id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "No user found with the provided ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to delete user", error: (error as Error).message },
      { status: 500 }
    );
  }
}
