import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import ProductDataService from "@/services/productdataservices";
import { validateUpdateProduct } from "@/validations/productvalidation";
import { ApiResponse, IProductResponse, IUpdateProductRequest } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<IProductResponse | null>>
) {
  await dbConnect();

  const {
    query: { productId },
    method,
  } = req;

  if (typeof productId !== "string") {
    return res
      .status(400)
      .json({
        success: false,
        error: { message: "Invalid Product ID provided." },
      });
  }

  switch (method) {
    case "GET":
      try {
        const product = await ProductDataService.getProductById(productId);

        if (!product) {
          return res
            .status(404)
            .json({ success: false, error: { message: "Product not found." } });
        }

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

        res.status(200).json({ success: true, data: productResponse });
      } catch (error: any) {
        console.error(`API Error (GET /api/products/${productId}):`, error);
        res
          .status(500)
          .json({
            success: false,
            error: { message: error.message || "Server Error" },
          });
      }
      break;

    case "PUT":
      try {
        const updatedProductData: IUpdateProductRequest = req.body;
        await validateUpdateProduct(updatedProductData);

        const product = await ProductDataService.updateProduct(
          productId,
          updatedProductData
        );

        if (!product) {
          return res
            .status(404)
            .json({
              success: false,
              error: { message: "Product not found for update." },
            });
        }

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

        res.status(200).json({ success: true, data: productResponse });
      } catch (error: any) {
        console.error(`API Error (PUT /api/products/${productId}):`, error);
        if (error.issues && Array.isArray(error.issues)) {
          return res
            .status(400)
            .json({
              success: false,
              error: { message: "Validation Error", details: error.issues },
            });
        }
        if (error.name === "ValidationError") {
          const messages = Object.values(error.errors).map(
            (val: any) => val.message
          );
          return res
            .status(400)
            .json({
              success: false,
              error: {
                message: "Mongoose Validation Error",
                details: messages,
              },
            });
        }
        res
          .status(500)
          .json({
            success: false,
            error: { message: error.message || "Server Error" },
          });
      }
      break;

    case "DELETE":
      try {
        const deletedProduct = await ProductDataService.deleteProduct(
          productId
        );

        if (!deletedProduct) {
          return res
            .status(404)
            .json({
              success: false,
              error: { message: "Product not found for deletion." },
            });
        }

        res
          .status(200)
          .json({ success: true, message: "Product deleted successfully." });
      } catch (error: any) {
        console.error(`API Error (DELETE /api/products/${productId}):`, error);
        res
          .status(500)
          .json({
            success: false,
            error: { message: error.message || "Server Error" },
          });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
