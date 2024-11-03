import { Schema, model } from "mongoose";

import { User } from "@interfaces/.";

export const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    sessionStatus: {
      type: String,
      default: "offline",
      enum: ["online", "offline"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = model("users", UserSchema);

export default UserModel;
