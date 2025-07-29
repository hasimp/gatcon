import {
  IProductResponse,
  ICreateProductRequest,
  IUpdateProductRequest,
  PaginatedApiResponse,
  ApiResponse,
} from "@/types";

const API_BASE_URL = "/api";

export const api = {
  getProducts: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedApiResponse<IProductResponse[]>> => {
    const res = await fetch(
      `${API_BASE_URL}/products?page=${page}&limit=${limit}`
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "Failed to fetch products");
    }
    return res.json();
  },

  getProductById: async (
    id: string
  ): Promise<ApiResponse<IProductResponse>> => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "Failed to fetch product");
    }
    return res.json();
  },

  createProduct: async (
    product: ICreateProductRequest
  ): Promise<ApiResponse<IProductResponse>> => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "Failed to create product");
    }
    return res.json();
  },

  updateProduct: async (
    id: string,
    product: IUpdateProductRequest
  ): Promise<ApiResponse<IProductResponse>> => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "Failed to update product");
    }
    return res.json();
  },

  deleteProduct: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "Failed to delete product");
    }
    return res.json();
  },
};
