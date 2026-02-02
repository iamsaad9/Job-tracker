const express = require("express");
const router = express.Router();
const { ID } = require("node-appwrite");
const { storage, bucketId } = require("../services/appwrite"); // Path to your config
const Documents = require("../models/Documents");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

// Helper function to create File from buffer (compatible with Node.js 18+)
function createFileFromBuffer(buffer, filename, mimeType) {
  // Check if native File class is available (Node.js 22+)
  if (typeof File !== 'undefined') {
    return new File([buffer], filename, { type: mimeType });
  }
  
  // Fallback for Node.js 18: Use Blob and create a File-like object
  // Note: For Node.js 18, you may need to install 'web-file-polyfill': npm install web-file-polyfill
  try {
    const { File: FilePolyfill } = require("web-file-polyfill");
    return new FilePolyfill([buffer], filename, { type: mimeType });
  } catch (e) {
    // If polyfill is not installed, throw a helpful error
    throw new Error(
      "File class not available. For Node.js 18 or lower, please install 'web-file-polyfill': npm install web-file-polyfill"
    );
  }
}

// 1. Create/Upload a New Document
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File is required" });
    }

    const { type, title, description } = req.body;
    const isDefault = req.body.isDefault === 'true';

    if (!type || !title) {
      return res.status(400).json({ success: false, message: "Type and title are required" });
    }

    // Step A: Handle Default Logic
    if (isDefault) {
      await Documents.updateMany(
        { user: req.user.id, type: type },
        { isDefault: false }
      );
    }

    // Step B: Upload to Appwrite
    // Create a File object from the buffer (node-appwrite v22+ uses native File class)
    const file = createFileFromBuffer(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
    
    const appwriteFile = await storage.createFile(
      bucketId,
      ID.unique(),
      file
    );

    // Step C: Save to MongoDB
    const newDoc = new Documents({
      user: req.user.id,
      type,
      title,
      description,
      isDefault,
      file: {
        fileId: appwriteFile.$id,
        fileName: appwriteFile.name || req.file.originalname,
        mimeType: appwriteFile.mimeType || req.file.mimetype,
        size: appwriteFile.sizeOriginal || req.file.size,
      },
    });

    await newDoc.save();
    res.status(201).json({ success: true, data: newDoc });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Get User Documents
router.get("/", authMiddleware, async (req, res) => {
  try {
    const query = { user: req.user.id, isArchived: false };
    if (req.query.type) query.type = req.query.type;

    const documents = await Documents.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: documents.length, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Update Metadata (Title/Description/Default)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { isDefault, type } = req.body;
    
    // Update logic for default status
    if (isDefault === true) {
      const doc = await Documents.findById(req.params.id);
      await Documents.updateMany(
        { user: req.user.id, type: type || doc.type, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    const updatedDoc = await Documents.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedDoc) return res.status(404).json({ message: "Document not found" });
    res.status(200).json({ success: true, data: updatedDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Archive and Clean up Appwrite
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const document = await Documents.findOne({ _id: req.params.id, user: req.user.id });

    if (!document) return res.status(404).json({ message: "Document not found" });

    // Step A: Remove from Appwrite Storage
    try {
      await storage.deleteFile(bucketId, document.file.fileId);
    } catch (appwriteErr) {
      console.error("Appwrite deletion failed:", appwriteErr.message);
      // We continue even if file is already gone from Appwrite
    }

    // Step B: Archive in DB (or delete)
    document.isArchived = true;
    await document.save();

    res.status(200).json({ success: true, message: "Document archived and file removed" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id/view", authMiddleware, async (req, res) => {
  try {
    const document = await Documents.findOne({ _id: req.params.id, user: req.user.id });
    if (!document) return res.status(404).json({ message: "Not found" });

    // 1. Fetch the file as a buffer from Appwrite (using your secret key)
    const arrayBuffer = await storage.getFileView(bucketId, document.file.fileId);
    const buffer = Buffer.from(arrayBuffer);

    // 2. Set headers so the browser knows it's a PDF (or image)
    res.setHeader("Content-Type", document.file.mimeType || "application/pdf");
    res.setHeader("Content-Disposition", "inline"); // 'inline' opens in browser, 'attachment' downloads

    // 3. Send the buffer
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;