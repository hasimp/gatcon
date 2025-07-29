import React, { useState, useEffect } from "react";
import {
  IProductResponse,
  ICreateProductRequest,
  IUpdateProductRequest,
} from "@/types/productdata.dtos";

interface ProductFormProps {
  initialData?: IProductResponse | null;
  onSubmit: (
    data: ICreateProductRequest | IUpdateProductRequest
  ) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [productName, setProductName] = useState("");
  const [storageTemperature, setStorageTemperature] = useState<string>("");
  const [relativeHumidity, setRelativeHumidity] = useState<string>("");
  const [approximateStorageLife, setApproximateStorageLife] =
    useState<string>("");
  const [waterContentPercent, setWaterContentPercent] = useState<string>("");
  const [highestFreezingPointTemperature, setHighestFreezingPointTemperature] =
    useState<string>("");
  const [specificHeatAboveFreezingPoint, setSpecificHeatAboveFreezingPoint] =
    useState<string>("");
  const [specificHeatBelowFreezingPoint, setSpecificHeatBelowFreezingPoint] =
    useState<string>("");
  const [latentHeat, setLatentHeat] = useState<string>("");

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName);
      setStorageTemperature(String(initialData.storageTemperature));
      setRelativeHumidity(String(initialData.relativeHumidity));
      setApproximateStorageLife(String(initialData.approximateStorageLife));
      setWaterContentPercent(String(initialData.waterContentPercent));
      setHighestFreezingPointTemperature(
        String(initialData.highestFreezingPointTemperature)
      );
      setSpecificHeatAboveFreezingPoint(
        String(initialData.specificHeatAboveFreezingPoint)
      );
      setSpecificHeatBelowFreezingPoint(
        String(initialData.specificHeatBelowFreezingPoint)
      );
      setLatentHeat(String(initialData.latentHeat));
    } else {
      setProductName("");
      setStorageTemperature("");
      setRelativeHumidity("");
      setApproximateStorageLife("");
      setWaterContentPercent("");
      setHighestFreezingPointTemperature("");
      setSpecificHeatAboveFreezingPoint("");
      setSpecificHeatBelowFreezingPoint("");
      setLatentHeat("");
    }
    setValidationErrors({});
  }, [initialData]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!productName.trim()) errors.productName = "Product Name is required.";

    if (storageTemperature === "" || isNaN(Number(storageTemperature)))
      errors.storageTemperature = "Storage Temperature must be a number.";
    if (relativeHumidity === "" || isNaN(Number(relativeHumidity)))
      errors.relativeHumidity = "Relative Humidity must be a number.";
    if (approximateStorageLife === "" || isNaN(Number(approximateStorageLife)))
      errors.approximateStorageLife =
        "Approximate Storage Life must be a number.";
    if (waterContentPercent === "" || isNaN(Number(waterContentPercent)))
      errors.waterContentPercent = "Water Content Percent must be a number.";
    if (
      highestFreezingPointTemperature === "" ||
      isNaN(Number(highestFreezingPointTemperature))
    )
      errors.highestFreezingPointTemperature =
        "Highest Freezing Point Temperature must be a number.";
    if (
      specificHeatAboveFreezingPoint === "" ||
      isNaN(Number(specificHeatAboveFreezingPoint))
    )
      errors.specificHeatAboveFreezingPoint =
        "Specific Heat Above Freezing Point must be a number.";
    if (
      specificHeatBelowFreezingPoint === "" ||
      isNaN(Number(specificHeatBelowFreezingPoint))
    )
      errors.specificHeatBelowFreezingPoint =
        "Specific Heat Below Freezing Point must be a number.";
    if (latentHeat === "" || isNaN(Number(latentHeat)))
      errors.latentHeat = "Latent Heat must be a number.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validate()) {
      return;
    }

    const data: ICreateProductRequest | IUpdateProductRequest = {
      productName,
      storageTemperature: Number(storageTemperature),
      relativeHumidity: Number(relativeHumidity),
      approximateStorageLife: Number(approximateStorageLife),
      waterContentPercent: Number(waterContentPercent),
      highestFreezingPointTemperature: Number(highestFreezingPointTemperature),
      specificHeatAboveFreezingPoint: Number(specificHeatAboveFreezingPoint),
      specificHeatBelowFreezingPoint: Number(specificHeatBelowFreezingPoint),
      latentHeat: Number(latentHeat),
    };

    await onSubmit(data);
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ marginBottom: "15px", color: "#333" }}>
        {initialData ? "Edit Product" : "Add New Product"}
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: "15px" }}
      >
        <div>
          <label
            htmlFor="productName"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Product Name:
          </label>
          <input
            id="productName"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `1px solid ${
                validationErrors.productName ? "red" : "#ddd"
              }`,
              borderRadius: "4px",
            }}
            disabled={isSubmitting}
          />
          {validationErrors.productName && (
            <p style={{ color: "red", fontSize: "0.8em", marginTop: "5px" }}>
              {validationErrors.productName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="storageTemperature"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Storage Temperature (°C):
          </label>
          <input
            id="storageTemperature"
            type="number"
            value={storageTemperature}
            onChange={(e) => setStorageTemperature(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `1px solid ${
                validationErrors.storageTemperature ? "red" : "#ddd"
              }`,
              borderRadius: "4px",
            }}
            disabled={isSubmitting}
          />
          {validationErrors.storageTemperature && (
            <p style={{ color: "red", fontSize: "0.8em", marginTop: "5px" }}>
              {validationErrors.storageTemperature}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="relativeHumidity"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Relative Humidity (%):
          </label>
          <input
            id="relativeHumidity"
            type="number"
            value={relativeHumidity}
            onChange={(e) => setRelativeHumidity(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `1px solid ${
                validationErrors.relativeHumidity ? "red" : "#ddd"
              }`,
              borderRadius: "4px",
            }}
            disabled={isSubmitting}
          />
          {validationErrors.relativeHumidity && (
            <p style={{ color: "red", fontSize: "0.8em", marginTop: "5px" }}>
              {validationErrors.relativeHumidity}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="approximateStorageLife"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Approximate Storage Life (days):
          </label>
          <input
            id="approximateStorageLife"
            type="number"
            value={approximateStorageLife}
            onChange={(e) => setApproximateStorageLife(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `1px solid ${
                validationErrors.approximateStorageLife ? "red" : "#ddd"
              }`,
              borderRadius: "4px",
            }}
            disabled={isSubmitting}
          />
          {validationErrors.approximateStorageLife && (
            <p style={{ color: "red", fontSize: "0.8em", marginTop: "5px" }}>
              {validationErrors.approximateStorageLife}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="waterContentPercent"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Water Content (%):
          </label>
          <input
            id="waterContentPercent"
            type="number"
            value={waterContentPercent}
            onChange={(e) => setWaterContentPercent(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `1px solid ${
                validationErrors.waterContentPercent ? "red" : "#ddd"
              }`,
              borderRadius: "4px",
            }}
            disabled={isSubmitting}
          />
          {validationErrors.waterContentPercent && (
            <p style={{ color: "red", fontSize: "0.8em", marginTop: "5px" }}>
              {validationErrors.waterContentPercent}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="highestFreezingPointTemperature"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Highest Freezing Point Temp (°C):
          </label>
          <input
            id="highestFreezingPointTemperature"
            type="number"
            value={highestFreezingPointTemperature}
            onChange={(e) => setHighestFreezingPointTemperature(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `1px solid ${
                validationErrors.highestFreezingPointTemperature
                  ? "red"
                  : "#ddd"
              }`,
              borderRadius: "4px",
            }}
            disabled={isSubmitting}
          />
          {validationErrors.highestFreezingPointTemperature && (
            <p style={{ color: "red", fontSize: "0.8em", marginTop: "5px" }}>
              {validationErrors.highestFreezingPointTemperature}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="specificHeatAboveFreezingPoint"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Specific Heat Above Freezing Point:
          </label>
          <input
            id="specificHeatAboveFreezingPoint"
            type="number"
            value={specificHeatAboveFreezingPoint}
            onChange={(e) => setSpecificHeatAboveFreezingPoint(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `1px solid ${
                validationErrors.specificHeatAboveFreezingPoint ? "red" : "#ddd"
              }`,
              borderRadius: "4px",
            }}
            disabled={isSubmitting}
          />
          {validationErrors.specificHeatAboveFreezingPoint && (
            <p style={{ color: "red", fontSize: "0.8em", marginTop: "5px" }}>
              {validationErrors.specificHeatAboveFreezingPoint}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="specificHeatBelowFreezingPoint"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Specific Heat Below Freezing Point:
          </label>
          <input
            id="specificHeatBelowFreezingPoint"
            type="number"
            value={specificHeatBelowFreezingPoint}
            onChange={(e) => setSpecificHeatBelowFreezingPoint(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `1px solid ${
                validationErrors.specificHeatBelowFreezingPoint ? "red" : "#ddd"
              }`,
              borderRadius: "4px",
            }}
            disabled={isSubmitting}
          />
          {validationErrors.specificHeatBelowFreezingPoint && (
            <p style={{ color: "red", fontSize: "0.8em", marginTop: "5px" }}>
              {validationErrors.specificHeatBelowFreezingPoint}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="latentHeat"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Latent Heat:
          </label>
          <input
            id="latentHeat"
            type="number"
            value={latentHeat}
            onChange={(e) => setLatentHeat(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `1px solid ${
                validationErrors.latentHeat ? "red" : "#ddd"
              }`,
              borderRadius: "4px",
            }}
            disabled={isSubmitting}
          />
          {validationErrors.latentHeat && (
            <p style={{ color: "red", fontSize: "0.8em", marginTop: "5px" }}>
              {validationErrors.latentHeat}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "10px 20px",
              backgroundColor: isSubmitting ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              flexGrow: 1,
            }}
          >
            {isSubmitting
              ? initialData
                ? "Updating..."
                : "Adding..."
              : initialData
              ? "Update Product"
              : "Add Product"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
