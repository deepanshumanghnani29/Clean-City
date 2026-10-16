const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WasteReport',
    },
    points: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      enum: ['report_submitted', 'report_verified', 'education_completed', 'bonus'],
      required: true,
    },
    description: String,
  },
  { timestamps: true }
);

rewardSchema.index({ userId: 1 });

module.exports = mongoose.model('Reward', rewardSchema);
