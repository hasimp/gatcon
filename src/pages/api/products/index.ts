import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import ProductDataService from "@/services/productdataservices";
import { validateCreateProduct } from "@/validations/productvalidation";
import {
  ApiResponse,
  PaginatedApiResponse,
  IProductResponse,
  ICreateProductRequest,
} from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | ApiResponse<IProductResponse[] | IProductResponse>
    | PaginatedApiResponse<IProductResponse[]>
  >
) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const { products, total } = await ProductDataService.getAllProducts(
          page,
          limit
        );

        const productResponses: IProductResponse[] = products.map((p) => ({
          id: p._id.toString(),
          productName: p.productName,
          storageTemperature: p.storageTemperature,
          relativeHumidity: p.relativeHumidity,
          approximateStorageLife: p.approximateStorageLife,
          waterContentPercent: p.waterContentPercent,
          highestFreezingPointTemperature: p.highestFreezingPointTemperature,
          specificHeatAboveFreezingPoint: p.specificHeatAboveFreezingPoint,
          specificHeatBelowFreezingPoint: p.specificHeatBelowFreezingPoint,
          latentHeat: p.latentHeat,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        }));

        res.status(200).json({
          success: true,
          data: productResponses,
          pagination: {
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            itemsPerPage: limit,
          },
        });
      } catch (error: any) {
        console.error("API Error (GET /api/products):", error);
        res.status(500).json({
          success: false,
          error: { message: error.message || "Server Error" },
        });
      }
      break;

    case "POST":
      try {
        const newProductData: ICreateProductRequest = req.body;
        await validateCreateProduct(newProductData);

        const product = await ProductDataService.createProduct(newProductData);

        const productResponse: IProductResponse = {
          id: product._id.toString(),
          productName: product.productName,
          storageTemperature: product.storageTemperature,
          relativeHumidity: product.relativeHumidity,
          approximateStorageLife: product.approximateStorageLife,
          waterContentPercent: product.waterContentPercent,
          highestFreezingPointTemperature:
            product.highestFreezingPointTemperature,
          specificHeatAboveFreezingPoint:
            product.specificHeatAboveFreezingPoint,
          specificHeatBelowFreezingPoint:
            product.specificHeatBelowFreezingPoint,
          latentHeat: product.latentHeat,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
        };

        res.status(201).json({ success: true, data: productResponse });
      } catch (error: any) {
        console.error("API Error (POST /api/products):", error);

        if (error.issues && Array.isArray(error.issues)) {
          return res.status(400).json({
            success: false,
            error: { message: "Validation Error", details: error.issues },
          });
        }

        if (error.name === "ValidationError") {
          const messages = Object.values(error.errors).map(
            (val: any) => val.message
          );
          return res.status(400).json({
            success: false,
            error: {
              message: "Mongoose Validation Error",
              details: messages,
            },
          });
        }
        res.status(500).json({
          success: false,
          error: { message: error.message || "Server Error" },
        });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
