import { Document, ObjectId } from "mongoose";

export interface IProductData extends Document {
  _id: ObjectId;
  productName: string;
  storageTemperature: number;
  relativeHumidity: number;
  approximateStorageLife: number;
  waterContentPercent: number;
  highestFreezingPointTemperature: number;
  specificHeatAboveFreezingPoint: number;
  specificHeatBelowFreezingPoint: number;
  latentHeat: number;
  createdAt: Date;
  updatedAt: Date;
};
