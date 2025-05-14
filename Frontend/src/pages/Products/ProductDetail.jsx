import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ErrorComponent from "../ErrorComponent";
import styles from "../../components/css/Products/ProductDetailStyle";

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

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError({
          status: err.response?.status || null,
          message:
            err.response?.data?.message ||
            "Ürün detayları alınırken hata oluştu.",
          errorMessage: err.response?.data?.error || "Bir Hata Oluştu",
        });
        console.error("Fetch product error:", err);
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

  const handleBuy = async () => {
    if (!user) {
      setMessage({
        type: "error",
        text: "Lütfen önce giriş yapın.",
        status: 401,
      });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    if (!product) {
      setMessage({
        type: "error",
        text: "Ürün bilgisi bulunamadı.",
        status: null,
      });
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
        status: null,
      });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message || "Sipariş oluşturulurken hata oluştu.",
        status: err.response?.status || null,
      });
      setTimeout(() => setMessage(null), 5000);
      console.error("Buy error:", err);
    }
  };

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
  if (error)
    return (
      <ErrorComponent
        status={error.status}
        message={error.message}
        error={error.errorMessage}
      />
    );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {product ? (
          <>
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
