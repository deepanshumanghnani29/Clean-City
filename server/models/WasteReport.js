const mongoose = require('mongoose');

const wasteReportSchema = new mongoose.Schema(
  {
    complaintNumber: {
      type: String,
      unique: true,
      default: () => `CC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image is required'],
    },
    imagePublicId: String, // Cloudinary public ID
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      enum: ['plastic', 'paper', 'glass', 'metal', 'organic', 'ewaste', 'mixed', 'other'],
      required: [true, 'Category is required'],
    },
    aiPredictedCategory: {
      type: String,
      enum: ['plastic', 'paper', 'glass', 'metal', 'organic', 'ewaste', 'mixed', 'other', null],
      default: null,
    },
    aiConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },
    aiProvider: {
      type: String,
      default: null,
    },
    aiProcessingStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'skipped'],
      default: 'pending',
    },
    aiAlternatives: [
      {
        category: String,
        confidence: Number,
      },
    ],
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: -180,
      max: 180,
    },
    address: {
      type: String,
      maxlength: 500,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending_review', 'pending', 'assigned', 'in_progress', 'awaiting_verification', 'resolved', 'rejected'],
      default: 'pending_review',
    },
    assignedStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedAt: Date,
    rejectionReason: String,
    isDemo: {
      type: Boolean,
      default: false,
    },
    resolvedAt: Date,
  },
  { timestamps: true }
);

wasteReportSchema.index({ reporterId: 1 });
wasteReportSchema.index({ status: 1 });
wasteReportSchema.index({ category: 1 });
wasteReportSchema.index({ latitude: 1, longitude: 1 });
wasteReportSchema.index({ createdAt: -1 });
wasteReportSchema.index({ complaintNumber: 1 });

module.exports = mongoose.model('WasteReport', wasteReportSchema);
