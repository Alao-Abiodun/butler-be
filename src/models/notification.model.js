const { Schema, model } = require('mongoose');

const NotificationModelSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    text: {
      type: String,
      required: true
    },
    body: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

NotificationModelSchema.index({ user: 1 });


module.exports = {
  NotificationModelSchema, // So schema can be reused in multi db setup
  Notification: model('notification', NotificationModelSchema),
};
