import { AuthType } from "./../generated/graphql";
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    authType: {
      type: String,
      enum: [AuthType.Credentails, AuthType.MagicLink, AuthType.Social],
      required: true,
      default: AuthType.Credentails,
    },
    password: {
      type: String,
    },

    security: {
      resetPassword: {
        otp: Number,
        token: String,
        expiry: Date,
      },
      verification: {
        otp: Number,
        token: String,
        expiry: Date,
      },
    },
    address: {
      city: {
        type: String,
      },
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      pincode: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

export default model("User", userSchema);
