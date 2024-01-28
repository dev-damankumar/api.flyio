import mongoose, { Schema, model } from "mongoose";

const meetingSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    users: [
      {
        email: {
          type: mongoose.Schema.Types.String,
          required: true,
          ref: "User",
        },
      },
    ],
    host: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Meeting = model("meeting", meetingSchema);

export default Meeting;
