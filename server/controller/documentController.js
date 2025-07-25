import myDocument from '../models/documentModel.js';
import Parcel from '../models/parcelModel.js';
import fs from 'fs';
import path from 'path';

// ✅ Upload Document
export const uploadDocument = async (req, res) => {
  try {
    const { name, type, parcelId, dateIssued } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
      return res.status(404).json({ message: 'Parcel not found' });
    }

    const newDoc = await myDocument.create({
      name,
      type,
      parcel: parcelId,
      dateIssued,
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: newDoc,
    });
  } catch (error) {
    console.error('❌ Upload Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get Documents Uploaded by Current User
export const getMyDocuments = async (req, res) => {
  try {
    const documents = await myDocument
      .find({ uploadedBy: req.user._id })
      .populate('parcel', 'lrNumber');

    const formatted = documents.map((doc) => ({
      ...doc._doc,
      parcelLR: doc.parcel?.lrNumber || 'N/A',
    }));

    res.status(200).json({ documents: formatted });
  } catch (error) {
    console.error('❌ Fetch My Documents Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Admin: Get All Documents (with deep parcel and owner details)
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await myDocument
      .find()
      .populate({
        path: 'parcel',
        select: 'lrNumber owner',
        populate: {
          path: 'owner',
          model: 'User', // Must match what you use in userModel.js
          select: 'fullName email',
        },
      })
      .populate('uploadedBy', 'name email role');

    const formatted = documents.map((doc) => ({
      _id: doc._id,
      name: doc.name,
      type: doc.type,
      status: doc.status,
      fileUrl: doc.fileUrl,
      dateIssued: doc.dateIssued,
      createdAt: doc.createdAt,
      parcelLR: doc.parcel?.lrNumber || 'N/A',
      parcelOwner: doc.parcel?.owner?.fullName || 'N/A', // 🔥 This should now work
      uploader: doc.uploadedBy?.name || 'Unknown',
      uploaderEmail: doc.uploadedBy?.email || '',
    }));

    res.status(200).json({ documents: formatted });
  } catch (error) {
    console.error('❌ Fetch All Documents Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ Delete Document (Uploader or Admin Only)
export const deleteDocument = async (req, res) => {
  try {
    const doc = await myDocument.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const isOwner = doc.uploadedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }

    const filePath = path.join('uploads', path.basename(doc.fileUrl));
    fs.unlink(filePath, (err) => {
      if (err) console.warn('⚠️ Failed to delete file from disk:', err);
    });

    await doc.deleteOne();
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('❌ Delete Document Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
