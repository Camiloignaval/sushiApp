import { ISettingsStore } from "./../interfaces/settings";
import mongoose, { Schema, Model, model } from "mongoose";
import { IProduct } from "../interfaces";
import mongoose_delete from "mongoose-delete";

const settingsSchema = new Schema(
  {
    lunes: {
      open: { type: Boolean, required: true },
      scheduleOpen: { type: String, required: true },
      scheduleClose: { type: String, required: true },
    },
    martes: {
      open: { type: Boolean, required: true },
      scheduleOpen: { type: String, required: true },
      scheduleClose: { type: String, required: true },
    },
    miercoles: {
      open: { type: Boolean, required: true },
      scheduleOpen: { type: String, required: true },
      scheduleClose: { type: String, required: true },
    },
    jueves: {
      open: { type: Boolean, required: true },
      scheduleOpen: { type: String, required: true },
      scheduleClose: { type: String, required: true },
    },
    viernes: {
      open: { type: Boolean, required: true },
      scheduleOpen: { type: String, required: true },
      scheduleClose: { type: String, required: true },
    },
    sabado: {
      open: { type: Boolean, required: true },
      scheduleOpen: { type: String, required: true },
      scheduleClose: { type: String, required: true },
    },
    domingo: {
      open: { type: Boolean, required: true },
      scheduleOpen: { type: String, required: true },
      scheduleClose: { type: String, required: true },
    },
    forceClose: { type: Boolean, required: true },
    forceOpen: { type: Boolean, required: true },
    kmPrice: { type: Number, required: true },
    customRoll: {
      proteins: { type: Number, required: true },
      vegetables: { type: Number, required: true },
      sauces: { type: Number, required: true },
      extraProducts: { type: Number, required: true },
    },
  },
  { timestamps: true, versionKey: false }
);

settingsSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Settings: Model<ISettingsStore> =
  mongoose.models.Settings || model("Settings", settingsSchema);

export default Settings;
