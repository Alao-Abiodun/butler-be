const { Schema, model } = require('mongoose');
const { DEFAULT_SERVICE_IMG, DEFAULT_SERVICE_ICON } = require('../utils/constants');

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      maxlength: 60,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      maxlength: 60,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
      default: DEFAULT_SERVICE_IMG,
    },
    images: [{
      type: String,
      default: DEFAULT_SERVICE_ICON,
    }],
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE"],
    },
    visible: {
      type: Boolean,
      default: true,
    },
    active_states: [{
      type: Schema.Types.ObjectId,
      ref: "state",
    }],
    active_cities: [String],
    packages: [
      {
        type: Schema.Types.ObjectId,
        ref: "package",
      },
    ],
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'category'
      }
    ],
    sales_item: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: 'item'
        },
        price: {
          type: Number,
        },
        min_quantity: {
          type: Number,
          default: 0
        },
        max_quantity: {
          type: Number,
          default: 0
        },
      }
    ],
    tagline: {
      type: String,
    },
    steps: [{
      type: String
    }]
  },

  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = model('service', serviceSchema);
