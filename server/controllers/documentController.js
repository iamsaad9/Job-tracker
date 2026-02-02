const Documents = require("../models/Documents");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

//Create a New Document
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Validation: type and file.fileId must be present
    if (!req.body.type || !req.body.file?.fileId) {
      return res.status(400).json({ message: "Invalid document data" });
    }

    const { type, isDefault } = req.body;

    // If this is set as default, unset previous default of the same type
    if (isDefault) {
      await Documents.updateMany(
        { user: req.user.id, type: type },
        { isDefault: false },
      );
    }

    const newDoc = new Documents({
      ...req.body,
      user: req.user.id,
    });

    await newDoc.save();
    res.status(201).json({ success: true, data: newDoc });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//Get User Documents (with Filters)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const query = { user: req.user.id, isArchived: false };

    // Allow filtering by type: /api/documents?type=cv
    if (req.query.type) query.type = req.query.type;

    const documents = await Documents.find(query).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: documents.length, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//Updating a document
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const existingDoc = await Documents.findOne({
      _id: req.params.id,
      user: req.user.id,
      isArchived: false,
    });

    if (!existingDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    const { isDefault, type, file } = req.body;
    const docType = type || existingDoc.type;

    // Handle default logic ONLY if isDefault is true
    if (isDefault === true) {
      await Documents.updateMany(
        {
          user: req.user.id,
          type: docType,
          _id: { $ne: req.params.id },
        },
        { isDefault: false },
      );
    }

    const update = { $set: req.body };

    // Increment version ONLY if file is updated
    if (file?.fileId) {
      update.$inc = { version: 1 };
    }

    const updatedDoc = await Documents.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      update,
      { new: true },
    );

    res.status(200).json({ success: true, data: updatedDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//Deleting a document
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const document = await Documents.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!document)
      return res.status(404).json({ message: "Document not found" });

    // Instead of deleting, archive the document
    document.isArchived = true;
    await document.save();
    res.status(200).json({ success: true, message: "Document archived" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
