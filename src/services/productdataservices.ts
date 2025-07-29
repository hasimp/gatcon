import { ProductData } from "@/models";
import {
  IProductData,
  ICreateProductRequest,
  IUpdateProductRequest,
} from "@/types";

const ProductDataService = {
  getAllProducts: async (
    page: number = 1,
    limit: number = 1
  ): Promise<{ products: IProductData[]; total: number }> => {
    const skip = (page - 1) * limit;
    const products = await ProductData.find({}).limit(limit).skip(skip).lean();
    const total = await ProductData.countDocuments({});
    return { products, total };
  },
  getProductById: async (id: string): Promise<IProductData | null> => {
    return ProductData.findById(id).lean();
  },
  createProduct: async (data: ICreateProductRequest): Promise<IProductData> => {
    return ProductData.create(data);
  },
  updateProduct: async (
    id: string,
    data: IUpdateProductRequest
  ): Promise<IProductData | null> => {
    return ProductData.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  },
  deleteProduct: async (id: string): Promise<IProductData | null> => {
    return ProductData.findByIdAndDelete(id).lean();
  }
};


export default ProductDataService;