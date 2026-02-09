import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import Job from "@/app/models/Jobs";
import Documents from "@/app/models/Documents";
import { getServerSession } from "@/app/lib/auth";

interface UserSession {
  userId: string;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

// Updated interface to handle the removal object
interface UpdateJobBody {
  company?: string;
  position?: string;
  status?: string;
  notes?: string;
  // Specific field for unlinking a document
  removeDocument?: {
    docType: "cv" | "coverLetter" | "portfolio" | "other";
    docId: string;
  };
  // Field for tracking when a document is added/used
  documentId?: string; 
}

// Helper function to get error message from unknown
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error) || "An unknown error occurred";
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const session = await getServerSession() as UserSession | null;
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const job = await Job.findOne({ _id: id, user: session.userId }).populate("documents.cv documents.coverLetter documents.portfolio");

    if (!job) return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: job });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const session = await getServerSession() as UserSession | null;
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body: UpdateJobBody = await req.json();

    const updateData: Record<string, unknown> = { ...body };
    let mongoQuery: Record<string, unknown> = { $set: updateData };

     console.log("ROUTE")
    // --- CASE 1: UNLINKING A DOCUMENT ---
    if (body.removeDocument) {
      const { docType } = body.removeDocument;
      const updatePath = `documents.${docType}`;
      console.log("ROUTE")
      console.log("Doc Type: ",docType);
      console.log("Update Path: ",updatePath);
      // Use $set to null or $unset to remove the key
      mongoQuery = { $set: { [updatePath]: null } };
      // Delete the helper field so it doesn't get saved to the DB literally
      delete updateData.removeDocument; 
    }

    const updatedJob = await Job.findOneAndUpdate(
      { _id: id, user: session.userId },
      mongoQuery,
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    // --- CASE 2: TRACK USAGE ---
    // If a document was just added or used, update its timestamp
    if (body.documentId) {
      await Documents.findOneAndUpdate(
        { _id: body.documentId, user: session.userId },
        { lastUsedAt: new Date() }
      );
    }

    return NextResponse.json({ success: true, data: updatedJob });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const session = await getServerSession() as UserSession | null;
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const deletedJob = await Job.findOneAndDelete({ _id: id, user: session.userId });

    if (!deletedJob) return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Job application deleted" });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}