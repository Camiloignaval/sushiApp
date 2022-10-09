import { IExpense } from "./../interfaces/expense";
import mongoose, { Schema, Model, model } from "mongoose";
import mongoose_delete from "mongoose-delete";

import { ICategory } from "../interfaces";

const expenseSchema = new Schema(
  {
    week: { type: Date, required: true },
    bills: [{ expense: { type: Number, min: 0 }, name: { type: String } }],
    gains: { type: Number },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

expenseSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Expense: Model<IExpense> =
  mongoose.models.Expense || model("Expense", expenseSchema);

export default Expense;
