const { Schema, model } = require('mongoose');
const { DEFAULT_ITEM_ICON } = require('../utils/constants');

const itemSchema = new Schema(
  {
    name: {
      type: String,
      maxlength: 60,
      trim: true,
    },
    class: {
      type: String,
    },
    icon: {
      type: String,
      trim: true,
      default: DEFAULT_ITEM_ICON,
    },
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE"],
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = model('item', itemSchema);
