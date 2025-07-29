"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import {
  IProductResponse,
  ICreateProductRequest,
  IUpdateProductRequest,
} from "@/types";
import ProductForm from "@/components/productform";

export default function HomePage() {
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [editingProduct, setEditingProduct] = useState<IProductResponse | null>(
    null
  );

  const fetchProducts = async (currentPage: number, currentLimit: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getProducts(currentPage, currentLimit);
      if (response.success && response.data) {
        setProducts(response.data);
        setTotalItems(response.pagination?.totalItems || 0);
        setTotalPages(response.pagination?.totalPages || 0);
      } else {
        setError(response.error?.message || "Failed to fetch products.");
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, limit);
  }, [page, limit]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleCreateProduct = async (
    data: ICreateProductRequest | IUpdateProductRequest
  ) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const response = await api.createProduct(data as ICreateProductRequest);
      if (response.success) {
        console.log("Product created successfully:", response.data);
        await fetchProducts(page, limit);
      } else {
        const errorMessage =
          response.error?.message || "Failed to create product.";
        const errorDetails = response.error?.details
          ? JSON.stringify(response.error.details, null, 2)
          : "";
        setFormError(`${errorMessage}\n${errorDetails}`);
      }
    } catch (err: any) {
      console.error("Error creating product:", err);
      setFormError(
        err.message || "An unexpected error occurred during creation."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (
    data: ICreateProductRequest | IUpdateProductRequest
  ) => {
    if (!editingProduct?.id) {
      setFormError("No product selected for update.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      const response = await api.updateProduct(
        editingProduct.id,
        data as IUpdateProductRequest
      );
      if (response.success) {
        console.log("Product updated successfully:", response.data);
        setEditingProduct(null);
        await fetchProducts(page, limit);
      } else {
        const errorMessage =
          response.error?.message || "Failed to update product.";
        const errorDetails = response.error?.details
          ? JSON.stringify(response.error.details, null, 2)
          : "";
        setFormError(`${errorMessage}\n${errorDetails}`);
      }
    } catch (err: any) {
      console.error("Error updating product:", err);
      setFormError(
        err.message || "An unexpected error occurred during update."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }
    setLoading(true);
    try {
      const response = await api.deleteProduct(productId);
      if (response.success) {
        console.log(response.message || "Product deleted successfully.");
        await fetchProducts(page, limit);
      } else {
        setError(response.error?.message || "Failed to delete product.");
      }
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setError(err.message || "An unexpected error occurred during deletion.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product: IProductResponse) => {
    setEditingProduct(product);
    setFormError(null);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormError(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Product Management Dashboard</h1>

      <ProductForm
        initialData={editingProduct}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        onCancel={editingProduct ? cancelEdit : undefined}
        isSubmitting={isSubmitting}
      />
      {formError && (
        <pre
          style={{
            color: "red",
            border: "1px solid red",
            padding: "10px",
            backgroundColor: "#ffe6e6",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
        >
          {formError}
        </pre>
      )}

      <h2 style={{ marginTop: "30px" }}>Current Products</h2>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No products found. Add one using the form above!</p>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="limit-select">Items per page: </label>
            <select
              id="limit-select"
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(1);
              }}
              style={{
                padding: "5px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <h3>{product.productName}</h3>
                <p>Temp: {product.storageTemperature}°C</p>
                <p>Humidity: {product.relativeHumidity}%</p>
                <p>Life: {product.approximateStorageLife} days</p>
                <p>Water Content: {product.waterContentPercent}%</p>
                <p
                  style={{
                    fontSize: "0.8em",
                    color: "#666",
                    marginTop: "10px",
                  }}
                >
                  Created: {new Date(product.createdAt).toLocaleDateString()}
                </p>
                <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
                  <button
                    onClick={() => startEdit(product)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={handlePrevPage}
              disabled={page === 1 || loading}
              style={{
                marginRight: "10px",
                padding: "8px 15px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages} (Total {totalItems} items)
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages || loading}
              style={{
                marginLeft: "10px",
                padding: "8px 15px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
