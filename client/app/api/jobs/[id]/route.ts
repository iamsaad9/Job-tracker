import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Jobs";
import Documents from "@/models/Documents";
import { getServerSession } from "@/lib/auth";

// Define the Session shape based on what your JWT contains
interface UserSession {
  userId: string;
}

// Define the Dynamic Route Params
interface RouteContext {
  params: Promise<{ id: string }>;
}

// Define the expected body for updates
interface UpdateJobBody {
  documentId?: string;
  company?: string;
  role?: string;
  status?: string;
  // add other fields from your Job schema here
}
// GET single job by ID
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const session: UserSession | null = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const job = await Job.findOne({ _id: id, user: session.userId });

    if (!job) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT: Update a job
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const session: UserSession | null = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body: UpdateJobBody = await req.json();

    const updatedJob = await Job.findOneAndUpdate(
      { _id: id, user: session.userId },
      body,
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    // Track document usage
    if (body.documentId) {
      const doc = await Documents.findOne({
        _id: body.documentId,
        user: session.userId,
      });
      if (doc) {
        doc.lastUsedAt = new Date();
        await doc.save();
      }
    }

    return NextResponse.json({ success: true, data: updatedJob });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE: Delete a job
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const session: UserSession | null = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const deletedJob = await Job.findOneAndDelete({
      _id: id,
      user: session.userId,
    });

    if (!deletedJob) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Job application deleted",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
