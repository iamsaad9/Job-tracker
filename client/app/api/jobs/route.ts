import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import Job from "@/app/models/Jobs";
import { getServerSession } from "@/app/lib/auth";

// Define the Session shape
interface UserSession {
  userId: string;
  role?: string;
}

// Define the incoming Job body
interface JobApplicationBody {
  jobUrl: string;
  company: string;
  position: string;
  status?: string;
  applicationDate?: Date;
  // Add other fields from your Job model
}
// GET all jobs for the logged-in user
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const session: UserSession | null = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const jobs = await Job.find({ user: session.userId }).sort({
      applicationDate: -1,
    });

    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST: Create a new job application
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const session: UserSession | null = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Explicitly type the parsed JSON
    const body: JobApplicationBody = await req.json();

    if (!body.jobUrl) {
      return NextResponse.json(
        { success: false, message: "jobUrl is required" },
        { status: 400 }
      );
    }

    const existingJob = await Job.findOne({
      user: session.userId,
      jobUrl: body.jobUrl,
    });

    if (existingJob) {
      return NextResponse.json(
        {
          success: false,
          message: "Job application with this URL already exists",
        },
        { status: 400 },
      );
    }

    const newJob = await Job.create({
      ...body,
      user: session.userId,
    });

    return NextResponse.json({ success: true, data: newJob }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}