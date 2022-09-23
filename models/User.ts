import mongoose, { Schema, Model, model } from "mongoose";
import { IUser } from "../interfaces";
import mongoose_delete from "mongoose-delete";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true, unique: true },
    phone: { type: String },
    placeId: { type: String },
    role: {
      type: String,
      enum: {
        values: ["admin", "client", "delivery"],
        message: "${VALUE} no es un rol valido",
        default: "client",
        required: true,
      },
      default: "client",
    },
    password: { type: String },
    username: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const User: Model<IUser> = mongoose.models.User || model("User", userSchema);

export default User;
