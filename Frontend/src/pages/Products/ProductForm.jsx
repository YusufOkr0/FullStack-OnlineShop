import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import ErrorComponent from "../ErrorComponent";

const API_BASE_URL = "http://localhost:8080";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  const [photo, setPhoto] = useState(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorStatus, setErrorStatus] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Ürün verilerini ve fotoğrafı çekme
  useEffect(() => {
    if (id) {
      console.log("Fetching product with ID:", id);
      const fetchProductData = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/products/${id}`);
          const product = response.data;
          console.log("Product data:", product);
          setValue("name", product.name || "");
          setValue("supplier", product.supplier || "");
          setValue("price", product.price || 0);
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || "Ürün verileri yüklenemedi.";
          setError(errorMessage);
          setErrorStatus(err.response?.status || null);
          console.error("Fetch product error:", err);
          console.error("Error response:", err.response);
        }
      };

      const fetchPhoto = async () => {
        setPhotoLoading(true);
        try {
          const response = await api.get(`/products/${id}/image`, {
            responseType: "blob",
          });
          const imageUrl = URL.createObjectURL(response.data);
          setCurrentPhotoUrl(imageUrl);
        } catch (err) {
          console.error("Photo fetch error:", err);
          setCurrentPhotoUrl(null);
        } finally {
          setPhotoLoading(false);
        }
      };

      const loadData = async () => {
        await Promise.all([fetchProductData(), fetchPhoto()]);
        setLoading(false);
      };

      loadData();
    } else {
      reset({
        name: "",
        supplier: "",
        price: "",
      });
      setCurrentPhotoUrl(null);
    }

    // Cleanup Blob URL
    return () => {
      if (currentPhotoUrl) {
        URL.revokeObjectURL(currentPhotoUrl);
      }
    };
  }, [id, setValue, reset]);

  // Modal için otomatik kapanma ve yönlendirme
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        console.log("Navigating to /products from modal timeout");
        navigate("/products", { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  // Fotoğraf yükleme
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setCurrentPhotoUrl(URL.createObjectURL(file));
    }
  };

  // Form gönderimi
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setErrorStatus(null);
    setSuccessMessage("");
    console.log("Submitting form with data:", data);
    try {
      const formData = new FormData();
      const productRequest = {
        name: data.name,
        supplier: data.supplier,
        price: data.price, // Backend number kabul ediyorsa string'e çevirmeye gerek yok
      };
      formData.append(
        id ? "updateProductRequest" : "addProductRequest",
        new Blob([JSON.stringify(productRequest)], {
          type: "application/json",
        })
      );
      if (photo) {
        formData.append("file", photo);
      }

      // FormData içeriğini konsola yazdır
      for (let [key, value] of formData.entries()) {
        console.log(`FormData: ${key} =`, value);
      }

      let response;
      if (id) {
        console.log(`Sending PUT request to /products/updateById/${id}`);
        response = await api.put(`/products/updateById/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        console.log("Sending POST request to /products/add");
        response = await api.post("/products/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setSuccessMessage(
        response.data ||
          (id ? "Ürün başarıyla güncellendi!" : "Ürün başarıyla eklendi!")
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        "Ürün kaydedilirken bir hata oluştu.";
      setError(errorMessage);
      setErrorStatus(err.response?.status || null);
      console.error("Submit error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
      console.error("Response headers:", err.response?.headers);
    } finally {
      setLoading(false);
    }
  };

  // Modal kapatma ve yönlendirme
  const handleModalClose = () => {
    setSuccessMessage("");
    console.log("Navigating to /products from modal close");
    navigate("/products", { replace: true });
  };

  // Responsive inline styles
  const isMobile = window.innerWidth <= 768;
  const styles = {
    container: {
      minHeight: "calc(100vh - 60px)",
      width: "100%",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)",
      padding: isMobile ? "20px" : "40px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Inter', sans-serif",
    },
    title: {
      fontSize: isMobile ? "28px" : "36px",
      color: "#1a202c",
      fontWeight: "700",
      fontFamily: "'Inter', sans-serif",
      marginBottom: isMobile ? "20px" : "30px",
      textAlign: "center",
      animation: "fadeIn 0.5s ease-in-out",
    },
    form: {
      maxWidth: "600px",
      width: "100%",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      padding: isMobile ? "20px" : "30px",
      animation: "fadeIn 0.5s ease-in-out",
    },
    photoContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: isMobile ? "15px" : "20px",
    },
    photo: {
      width: isMobile ? "120px" : "150px",
      height: isMobile ? "120px" : "150px",
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: "10px",
      border: "2px solid #dee2e6",
      backgroundColor: "#f8f9fa",
      transition: "transform 0.3s ease",
    },
    placeholder: {
      width: isMobile ? "120px" : "150px",
      height: isMobile ? "120px" : "150px",
      borderRadius: "50%",
      backgroundColor: "#f8f9fa",
      border: "2px solid #dee2e6",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "10px",
      transition: "transform 0.3s ease",
    },
    placeholderSvg: {
      width: isMobile ? "60px" : "80px",
      height: isMobile ? "60px" : "80px",
      fill: "#4a5568",
    },
    photoInput: {
      display: "none",
    },
    photoButton: {
      padding: isMobile ? "8px 16px" : "10px 20px",
      backgroundColor: "#5a67d8",
      color: "#ffffff",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    formGroup: {
      marginBottom: isMobile ? "15px" : "20px",
      textAlign: "left",
    },
    label: {
      fontSize: isMobile ? "14px" : "16px",
      color: "#1a202c",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      marginBottom: "8px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: isMobile ? "8px" : "10px",
      fontSize: isMobile ? "14px" : "16px",
      fontFamily: "'Inter', sans-serif",
      border: "1px solid #dee2e6",
      borderRadius: "8px",
      outline: "none",
      transition: "border-color 0.3s",
    },
    submitButton: {
      padding: isMobile ? "10px 20px" : "12px 24px",
      backgroundColor: "#5a67d8",
      color: "#ffffff",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
      width: "100%",
      marginTop: "20px",
    },
    errorMessage: {
      color: "#f56565",
      fontSize: isMobile ? "12px" : "14px",
      fontFamily: "'Inter', sans-serif",
      marginTop: "5px",
      display: "block",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: isMobile ? "20px" : "30px",
      maxWidth: isMobile ? "90%" : "400px",
      width: "100%",
      textAlign: "center",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
      animation: "modalFadeIn 0.3s ease-in-out",
    },
    modalMessage: {
      fontSize: isMobile ? "16px" : "18px",
      color: "#28a745",
      marginBottom: "20px",
      fontFamily: "'Inter', sans-serif",
    },
    modalButton: {
      padding: isMobile ? "8px 16px" : "10px 20px",
      backgroundColor: "#5a67d8",
      color: "#ffffff",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
  };

  // Hover ve focus efektleri
  styles.photo[":hover"] = {
    transform: "scale(1.05)",
  };
  styles.placeholder[":hover"] = {
    transform: "scale(1.05)",
  };
  styles.photoButton[":hover"] = {
    backgroundColor: "#4c51bf",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
  };
  styles.photoButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };
  styles.input[":focus"] = {
    borderColor: "#5a67d8",
    boxShadow: "0 0 0 3px rgba(90, 103, 216, 0.1)",
  };
  styles.submitButton[":hover"] = {
    backgroundColor: "#4c51bf",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
  };
  styles.submitButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };
  styles.submitButton[":disabled"] = {
    backgroundColor: "#a0aec0",
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "none",
  };
  styles.modalButton[":hover"] = {
    backgroundColor: "#4c51bf",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
  };
  styles.modalButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };

  // FadeIn ve modal animasyonları
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes modalFadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Hata varsa ErrorComponent göster
  if (error) {
    return <ErrorComponent status={errorStatus} message={error} />;
  }

  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.title}>{id ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h2>
        <div style={styles.form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Fotoğraf Bölümü */}
            <div style={styles.photoContainer}>
              {photoLoading && id ? (
                <p style={styles.loading}>Fotoğraf yükleniyor...</p>
              ) : currentPhotoUrl ? (
                <img src={currentPhotoUrl} alt="Ürün" style={styles.photo} />
              ) : (
                <div style={styles.placeholder} aria-label="Ürün resmi yok">
                  <svg
                    style={styles.placeholderSvg}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 16L8 14L10 16L13 13L17 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={styles.photoInput}
                id="photo-upload"
              />
              <label htmlFor="photo-upload" style={styles.photoButton}>
                Fotoğraf Yükle
              </label>
            </div>

            {/* Form Alanları */}
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.label}>
                Ürün Adı:
              </label>
              <input
                id="name"
                type="text"
                placeholder="Ürün adı girin"
                style={styles.input}
                {...register("name", { required: "Ürün adı zorunludur" })}
              />
              {errors.name && (
                <span style={styles.errorMessage}>{errors.name.message}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="supplier" style={styles.label}>
                Tedarikçi:
              </label>
              <input
                id="supplier"
                type="text"
                placeholder="Tedarikçi adı girin"
                style={styles.input}
                {...register("supplier", { required: "Tedarikçi zorunludur" })}
              />
              {errors.supplier && (
                <span style={styles.errorMessage}>
                  {errors.supplier.message}
                </span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="price" style={styles.label}>
                Fiyat:
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                placeholder="Ürün fiyatı girin"
                style={styles.input}
                {...register("price", {
                  required: "Fiyat zorunludur",
                  min: { value: 0, message: "Fiyat negatif olamaz" },
                  valueAsNumber: true,
                })}
              />
              {errors.price && (
                <span style={styles.errorMessage}>{errors.price.message}</span>
              )}
            </div>

            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading || photoLoading}
            >
              {loading ? "Kaydediliyor..." : id ? "Güncelle" : "Ekle"}
            </button>
          </form>
        </div>
      </div>
      {/* Modal */}
      {successMessage && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <p style={styles.modalMessage}>{successMessage}</p>
            <button onClick={handleModalClose} style={styles.modalButton}>
              Tamam
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductForm;
