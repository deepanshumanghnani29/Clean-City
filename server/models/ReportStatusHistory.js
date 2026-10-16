const mongoose = require('mongoose');

const reportStatusHistorySchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WasteReport',
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    previousStatus: {
      type: String,
      enum: ['pending_review', 'pending', 'assigned', 'in_progress', 'awaiting_verification', 'resolved', 'rejected'],
    },
    newStatus: {
      type: String,
      enum: ['pending_review', 'pending', 'assigned', 'in_progress', 'awaiting_verification', 'resolved', 'rejected'],
      required: true,
    },
    note: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

reportStatusHistorySchema.index({ reportId: 1 });

module.exports = mongoose.model('ReportStatusHistory', reportStatusHistorySchema);
