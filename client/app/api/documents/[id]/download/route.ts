import { NextRequest, NextResponse } from "next/server";
import { storage, bucketId } from "@/app/services/appwrite";
import Documents from "@/app/models/Documents";
import connectDB from "@/app/config/dbConfig";
import { getServerSession } from "@/app/lib/auth";

// Define the shape of params
interface RouteParams {
  params: Promise<{ id: string }>;
}


// 1. Download File
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // 1. Find the document in MongoDB
    const document = await Documents.findOne({ _id: id, user: session.userId });
    if (!document) {
      return NextResponse.json({ message: "Document not found" }, { status: 404 });
    }
    const fileBuffer = await storage.getFileDownload(bucketId, document.file.fileId);

    const response = new NextResponse(fileBuffer);
    
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${document.title || 'download'}"`
    );
    response.headers.set("Content-Type", document.file.mimeType || "application/octet-stream");

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}