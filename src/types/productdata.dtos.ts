import {
  CreateProductValidationInput,
  UpdateProductValidationInput,
} from "@/validations/productvalidation";

export interface ICreateProductRequest extends CreateProductValidationInput {}

export interface IUpdateProductRequest extends UpdateProductValidationInput {}

export interface IProductResponse {
  id: string;
  productName: string;
  storageTemperature: number;
  relativeHumidity: number;
  approximateStorageLife: number;
  waterContentPercent: number;
  highestFreezingPointTemperature: number;
  specificHeatAboveFreezingPoint: number;
  specificHeatBelowFreezingPoint: number;
  latentHeat: number;
  createdAt: string;
  updatedAt: string;
}
