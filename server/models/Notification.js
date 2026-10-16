const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: ['report_submitted', 'report_assigned', 'cleanup_started', 'awaiting_verification', 'resolved', 'rejected', 'system'],
      default: 'system',
    },
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WasteReport',
    },
    readAt: Date,
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, readAt: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
