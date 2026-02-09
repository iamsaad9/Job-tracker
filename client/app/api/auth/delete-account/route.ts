import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import User from "@/app/models/User";
import UserProfile from "@/app/models/UserProfile";
import Documents from "@/app/models/Documents"; // Assuming exported as Documents
import Job from "@/app/models/Jobs"; // Assuming exported as Job
import { getServerSession } from "@/app/lib/auth";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession();
    if (!session || !session.userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;

    /**
     * 1. DELETE JOBS
     * Removes all job applications tracked by the user.
     */
    await Job.deleteMany({ user: userId });

    /**
     * 2. DELETE DOCUMENTS
     * Removes metadata for CVs, Cover Letters, Portfolios, etc.
     * Note: If you use S3/Cloudinary, you should ideally fetch 
     * the fileIds and delete from cloud storage here too.
     */
    await Documents.deleteMany({ user: userId });

    /**
     * 3. DELETE PROFILE
     * Removes the education, experience, and basic profile info.
     */
    await UserProfile.findOneAndDelete({ user: userId });

    /**
     * 4. DELETE USER
     * Finally, remove the core login account.
     */
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "User account not found" },
        { status: 404 }
      );
    }
    

    const response = NextResponse.json({
      success: true,
      message: "All data associated with this account has been permanently removed.",
    });

    response.cookies.set("token", "", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  expires: new Date(0), // Sets expiration to 1970 (immediate deletion)
  sameSite: "lax"
});

return response;

  } catch (error) {
    console.error("CRITICAL: Account Deletion Failed", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}