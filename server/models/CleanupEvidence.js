const mongoose = require('mongoose');

const cleanupEvidenceSchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WasteReport',
      required: true,
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imagePublicId: String,
    notes: {
      type: String,
      maxlength: 500,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'returned'],
      default: 'pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: Date,
    returnReason: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

cleanupEvidenceSchema.index({ reportId: 1 });
cleanupEvidenceSchema.index({ staffId: 1 });

module.exports = mongoose.model('CleanupEvidence', cleanupEvidenceSchema);
