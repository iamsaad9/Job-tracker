import { NextRequest, NextResponse } from "next/server";
import { storage, bucketId } from "@/services/appwrite";
import Documents from "@/models/Documents";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await getServerSession();
    
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Await params for Next.js 15 compatibility
    const { id } = await params;

    const document = await Documents.findOne({ _id: id, user: session.userId });
    if (!document) {
      return new Response("Document Not Found", { status: 404 });
    }

    // 1. Appwrite returns an ArrayBuffer for file views
    const arrayBuffer = await storage.getFileView(
      bucketId,
      document.file.fileId
    );

    // 2. Return a raw Response object with the buffer
    // This allows the browser to stream the PDF/Image directly
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": document.file.mimeType || "application/pdf",
        "Content-Disposition": "inline", // 'inline' displays in browser, 'attachment' downloads
        "Cache-Control": "private, max-age=3600", // Optional: cache for 1 hour
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}