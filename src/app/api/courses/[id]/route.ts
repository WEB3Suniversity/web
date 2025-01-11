
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// app/api/courses/[id]/route.ts
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { db } = await connectToDatabase();
      const course = await req.json();
      const { id } = params;
  
      await db.collection('courses').updateOne(
        { _id: new ObjectId(id) },
        { $set: course }
      );
      
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: '更新课程失败' }, { status: 500 });
    }
  }
  
  export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { db } = await connectToDatabase();
      const { id } = params;
  
      await db.collection('courses').deleteOne({ _id: new ObjectId(id) });
      
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: '删除课程失败' }, { status: 500 });
    }
  }