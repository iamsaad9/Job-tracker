import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import Job from "@/app/models/Jobs";
import { getServerSession } from "@/app/lib/auth";
import "@/app/models/Documents";

// GET all jobs for the logged-in user
export async function GET() {
  try {
    await connectDB();
    
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Fetch jobs and populate document references
    const jobs = await Job.find({ user: session.userId })
      .populate('documents.cv', 'title file type isDefault')
      .populate('documents.coverLetter', 'title file type isDefault')
      .populate('documents.portfolio', 'title file type isDefault')
      .populate('documents.other', 'title file type isDefault')
      .sort({ applicationDate: -1 });

    return NextResponse.json({ success: true, data: jobs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
// POST: Create a new job application
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session || !session.userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Check for existing job (your logic)
    const existingJob = await Job.findOne({ user: session.userId, jobUrl: body.jobUrl });
    if (existingJob && body.jobUrl) {
      return NextResponse.json({ success: false, message: "Job already exists" }, { status: 400 });
    }

    // CREATE THE JOB WITH THE DOCUMENT IDs
    const newJob = await Job.create({
      ...body,
      user: session.userId,
      documents: {
        // These IDs come from the 'selectedDocuments' state on your frontend
        cv: body.documents?.cv || null,
        coverLetter: body.documents?.coverLetter || null,
        portfolio: body.documents?.portfolio || null,
        other: body.documents?.other || [],
      },
    });

    return NextResponse.json({ success: true, data: newJob }, { status: 201 });
  } catch (error: unknown) {
    console.error("Signup Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}