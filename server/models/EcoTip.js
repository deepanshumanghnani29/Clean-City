const mongoose = require('mongoose');

const ecoTipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ['reduce', 'reuse', 'recycle', 'composting', 'general', 'ewaste', 'hazardous'],
      default: 'general',
    },
    icon: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EcoTip', ecoTipSchema);
