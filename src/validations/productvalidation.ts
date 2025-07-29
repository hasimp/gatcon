import { z } from "zod";

const baseProductSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters long.")
    .max(100, "Product name cannot exceed 100 characters."),
  storageTemperature: z
    .number()
    .min(-273.15, "Temperature cannot be below absolute zero (-273.15°C).")
    .max(1000, "Temperature seems unusually high. Max 1000°C."),
  relativeHumidity: z
    .number()
    .min(0, "Relative humidity cannot be negative.")
    .max(100, "Relative humidity cannot exceed 100%"),
  approximateStorageLife: z
    .number()
    .int("Approximate storage life must be an integer.")
    .min(1, "Approximate storage life must be at least 1 day.")
    .max(3650, "Storage life should not exceed 3650 days (10 years)."),
  waterContentPercent: z
    .number()
    .min(0, "Water content cannot be negative.")
    .max(100, "Water content cannot exceed 100%."),
  highestFreezingPointTemperature: z
    .number()
    .min(-273.15, "Temperature cannot be below absolute zero (-273.15°C).")
    .max(100, "Temperature seems unusually high for a freezing point."),
  specificHeatAboveFreezingPoint: z
    .number()
    .min(0, "Specific heat above freezing point cannot be negative."),
  specificHeatBelowFreezingPoint: z
    .number()
    .min(0, "Specific heat below freezing point cannot be negative."),
  latentHeat: z.number().min(0, "Latent heat cannot be negative."),
});

export const createProductSchema = baseProductSchema;
export const updateProductSchema = baseProductSchema.partial();

export type CreateProductValidationInput = z.infer<typeof createProductSchema>;
export type UpdateProductValidationInput = z.infer<typeof updateProductSchema>;

export async function validateCreateProduct(
  data: CreateProductValidationInput
): Promise<CreateProductValidationInput> {
  return createProductSchema.parseAsync(data);
}

export async function validateUpdateProduct(
  data: UpdateProductValidationInput
): Promise<UpdateProductValidationInput> {
  return updateProductSchema.parseAsync(data);
}
