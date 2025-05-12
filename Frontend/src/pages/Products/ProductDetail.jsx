import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(
    "https://via.placeholder.com/150"
  );

  const [loading, setLoading] = useState(true);
  const [photoLoading, setPhotoLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Ürün verilerini ve fotoğrafı çekme
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Ürün detayları alınırken bir hata oluştu.");
        console.error(err);
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
        setCurrentPhotoUrl("https://via.placeholder.com/150");
      } finally {
        setPhotoLoading(false);
      }
    };

    const loadData = async () => {
      await Promise.all([fetchProductDetail(), fetchPhoto()]);
      setLoading(false);
    };

    loadData();
  }, [id]);

  // Satın alma işlemi
  const handleBuy = async () => {
    if (!user) {
      setMessage({ type: "error", text: "Lütfen önce giriş yapın." });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    if (!product) {
      setMessage({ type: "error", text: "Ürün bilgisi bulunamadı." });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    try {
      const response = await api.post("orders/buy", {
        customerId: user.id,
        productId: product.id,
      });
      setMessage({
        type: "success",
        text: response.data || "Sipariş oluşturuldu!",
      });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data || "Sipariş oluşturulurken hata oluştu.",
      });
      setTimeout(() => setMessage(null), 5000);
      console.error("Buy error:", err);
    }
  };

  // Responsive inline stiller
  const isMobile = window.innerWidth <= 768;
  const styles = {
    container: {
      minHeight: "calc(100vh - 60px)",
      width: "100%",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)",
      padding: isMobile ? "20px" : "40px",
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      maxWidth: "1000px",
      width: "100%",
      minHeight: isMobile ? "400px" : "500px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      animation: "fadeIn 0.5s ease-in-out",
    },
    imageContainer: {
      flex: "1",
      padding: isMobile ? "25px" : "40px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fafafa",
    },
    image: {
      maxWidth: "100%",
      maxHeight: isMobile ? "250px" : "300px",
      objectFit: "contain",
      borderRadius: "8px",
      transition: "transform 0.3s ease",
    },
    detailsContainer: {
      flex: "1",
      padding: isMobile ? "25px" : "40px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    title: {
      fontSize: isMobile ? "20px" : "24px",
      fontWeight: "600",
      color: "#1a202c",
      marginBottom: "15px",
    },
    supplier: {
      fontSize: isMobile ? "14px" : "16px",
      color: "#4a5568",
      marginBottom: "15px",
    },
    price: {
      fontSize: isMobile ? "16px" : "18px",
      fontWeight: "500",
      color: "#5a67d8",
      marginBottom: isMobile ? "20px" : "25px",
    },
    button: {
      width: "100%",
      padding: isMobile ? "10px" : "12px",
      backgroundColor: "#5a67d8",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    message: {
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "15px",
      fontSize: isMobile ? "14px" : "16px",
      textAlign: "center",
      fontFamily: "'Inter', sans-serif",
      animation: "fadeIn 0.5s ease-in-out",
    },
    successMessage: {
      backgroundColor: "#c6f6d5",
      color: "#28a745",
    },
    errorMessage: {
      backgroundColor: "#fed7d7",
      color: "#f56565",
    },
    loading: {
      textAlign: "center",
      fontSize: isMobile ? "16px" : "18px",
      color: "#4a5568",
      marginTop: "50px",
      animation: "fadeIn 0.5s ease-in-out",
    },
    error: {
      textAlign: "center",
      fontSize: isMobile ? "16px" : "18px",
      color: "#f56565",
      marginTop: "50px",
      animation: "fadeIn 0.5s ease-in-out",
    },
    notFound: {
      textAlign: "center",
      fontSize: isMobile ? "16px" : "18px",
      color: "#4a5568",
      padding: isMobile ? "15px" : "20px",
      animation: "fadeIn 0.5s ease-in-out",
    },
  };

  // Hover efektleri
  styles.image[":hover"] = {
    transform: "scale(1.05)",
  };
  styles.button[":hover"] = {
    backgroundColor: "#4c51bf",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
  };
  styles.button[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };

  // FadeIn animasyonu
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  if (loading) return <p style={styles.loading}>Yükleniyor...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {product ? (
          <>
            {/* Ürün Resmi */}
            <div style={styles.imageContainer}>
              {photoLoading ? (
                <p style={styles.loading}>Fotoğraf yükleniyor...</p>
              ) : (
                <img
                  src={currentPhotoUrl}
                  alt={product.name || "Ürün"}
                  style={styles.image}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              )}
            </div>
            {/* Ürün Detayları */}
            <div style={styles.detailsContainer}>
              {message && (
                <div
                  style={{
                    ...styles.message,
                    ...(message.type === "success"
                      ? styles.successMessage
                      : styles.errorMessage),
                  }}
                >
                  {message.text}
                </div>
              )}
              <div>
                <h1 style={styles.title}>{product.name}</h1>
                <p style={styles.supplier}>
                  <strong>Tedarikçi:</strong> {product.supplier}
                </p>
                <p style={styles.price}>
                  <strong>Fiyat:</strong> ${product.price.toFixed(2)}
                </p>
              </div>
              <button
                style={styles.button}
                onClick={handleBuy}
                onMouseOver={(e) =>
                  Object.assign(e.target.style, styles.button[":hover"])
                }
                onMouseOut={(e) =>
                  Object.assign(e.target.style, {
                    backgroundColor: "#5a67d8",
                    transform: "none",
                    boxShadow: "none",
                  })
                }
                onMouseDown={(e) =>
                  Object.assign(e.target.style, styles.button[":active"])
                }
                onMouseUp={(e) =>
                  Object.assign(e.target.style, {
                    transform: "translateY(-2px)",
                  })
                }
              >
                Satın Al
              </button>
            </div>
          </>
        ) : (
          <p style={styles.notFound}>Ürün bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
