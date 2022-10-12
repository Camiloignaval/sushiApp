import mongoose, { Schema, Model, model } from "mongoose";
import mongoose_delete from "mongoose-delete";

import { ICategory } from "../interfaces";

const categorySchema = new Schema(
  {
    name: { type: String },
    importanceNumber: { type: Number },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

categorySchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Category: Model<ICategory> =
  mongoose.models.Category || model("Category", categorySchema);

export default Category;
