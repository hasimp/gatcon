import mongoose, { Schema, Model } from "mongoose";
import { IProductData } from "@/types";

const ProductDataSchema: Schema<IProductData> = new Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters long."],
      maxlength: [100, "Product name cannot exceed 100 characters."],
    },
    storageTemperature: {
      type: Number,
      required: [true, "Storage temperature is required."],
      min: [-273.15, "Temperature cannot be below absolute zero."],
      max: [1000, "Temperature seems unusually high."],
    },
    relativeHumidity: {
      type: Number,
      required: [true, "Relative humidity is required."],
      min: [0, "Relative humidity cannot be negative."],
      max: [100, "Relative humidity cannot exceed 100%."],
    },
    approximateStorageLife: {
      type: Number,
      required: [true, "Approximate storage life is required."],
      min: [1, "Storage life is required."],
      max: [3650, "Storage is should not exceed 3650 days."],
    },
    waterContentPercent: {
      type: Number,
      required: [true, "Water content percentage is required."],
      min: [0, "Water content cannot be negative."],
      max: [100, "Water content cannot exceed 100%."],
    },
    highestFreezingPointTemperature: {
      type: Number,
      required: [true, "Highest freezing point temperature is required."],
      min: [-273.15, "Temperature cannot be below absolute zero."],
      max: [100, "temperature seems unusually high for a freezing point."],
    },
    specificHeatAboveFreezingPoint: {
      type: Number,
      required: [true, "Specific heat above freezing point is required."],
      min: [0, "Specific heat above freezing point cannot be negative."],
    },
    specificHeatBelowFreezingPoint: {
      type: Number,
      required: [true, "Specific heat below freezing point is required."],
      min: [0, "Specific heat below freezing point cannot be negative."],
    },
    latentHeat: {
      type: Number,
      required: [true, "Latent heat is required."],
      min: [0, "Latent heat cannot be negative."],
    },
  },
  {
    timestamps: true,
  }
);

const ProductData: Model<IProductData> =
  mongoose.models.ProductData ||
  mongoose.model<IProductData>("ProductData", ProductDataSchema);

export default ProductData;
