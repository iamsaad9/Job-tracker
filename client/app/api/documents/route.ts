import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { storage, bucketId } from "@/services/appwrite";
import Documents from "@/models/Documents";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(); // Updated: getServerSession usually handles cookies internally in Next.js
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    
    // 1. Type casting for FormData values
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const isDefault = formData.get("isDefault") === "true";

    if (!file || !type || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step A: Handle Default Logic
    if (isDefault) {
      await Documents.updateMunknown(
        { user: session.userId, type: type },
        { isDefault: false }
      );
    }

    // Step B: Upload to Appwrite
    // Appwrite's Node SDK expects a File object or InputFile
    const appwriteFile = await storage.createFile(
      bucketId,
      ID.unique(),
      file
    );

    // Step C: Save to MongoDB
    const newDoc = await Documents.create({
      user: session.userId,
      type,
      title,
      description,
      isDefault,
      file: {
        fileId: appwriteFile.$id,
        fileName: appwriteFile.name || file.name,
        mimeType: appwriteFile.mimeType || file.type,
        size: appwriteFile.sizeOriginal || file.size,
      },
    });

    return NextResponse.json({ success: true, data: newDoc }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    // 2. Define a typed query object
    const query: unknown = { user: session.userId, isArchived: false };
    if (type) query.type = type;

    const documents = await Documents.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      count: documents.length,
      data: documents,
    });
  }  catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}