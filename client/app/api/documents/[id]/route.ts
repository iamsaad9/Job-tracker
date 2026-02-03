import { NextRequest, NextResponse } from "next/server";
import { storage, bucketId } from "@/services/appwrite";
import Documents from "@/models/Documents";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "@/lib/auth";

// Define the shape of params
interface RouteParams {
  params: Promise<{ id: string }>;
}

// 3. Update Metadata
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // In Next.js 15, params is a Promise
    const { id } = await params;
    const body = await req.json();

    // Step A: Handle "Default" logic
    if (body.isDefault === true) {
      const doc = await Documents.findById(id);
      if (doc) {
        await Documents.updateMany(
          { 
            user: session.userId, 
            type: body.type || doc.type, 
            _id: { $ne: id } 
          },
          { isDefault: false }
        );
      }
    }

    // Step B: Update document
    const updatedDoc = await Documents.findOneAndUpdate(
      { _id: id, user: session.userId },
      { $set: body },
      { new: true }
    );

    if (!updatedDoc) {
      return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedDoc });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// 4. Archive / Delete
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const document = await Documents.findOne({ _id: id, user: session.userId });
    if (!document) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Step A: Remove from Appwrite Storage
    try {
      await storage.deleteFile(bucketId, document.file.fileId);
    } catch {
      console.error("Appwrite deletion failed");
    }

    // Step B: Update DB Status
    document.isArchived = true;
    await document.save();

    return NextResponse.json({ success: true, message: "Archived successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}