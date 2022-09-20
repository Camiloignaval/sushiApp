import mongoose, { Schema, Model, model } from "mongoose";
import { IUser } from "../interfaces";
import mongoose_delete from "mongoose-delete";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: {
        values: ["admin", "client", "delivery"],
        message: "${VALUE} no es un rol valido",
        default: "client",
        required: true,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const User: Model<IUser> = mongoose.models.User || model("User", userSchema);

export default User;
