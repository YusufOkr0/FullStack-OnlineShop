import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import ErrorComponent from "../ErrorComponent";
import styles from "../../components/css/Orders/OrderDetailStyle";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        console.log("Order detail:", response.data);
        setOrder(response.data);
      } catch (err) {
        console.log(err.response);
        setError({
          status: err.response?.data.status || null,
          message:
            err.response?.data?.message ||
            "Sipariş detayları alınırken bir hata oluştu.",
          errorMessage: err.response?.data?.error || "Bir Hata Oluştu",
        });
        console.error("Fetch order error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Geçersiz Tarih";
    return date.toISOString().split("T")[0];
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
  const isMobile = window.innerWidth <= 768;

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
      <div style={styles.header}>
        <h1 style={styles.title}>Sipariş Detayı</h1>
        <button
          style={styles.backButton}
          onClick={() => navigate("/orders")}
          onMouseOver={(e) =>
            Object.assign(e.target.style, styles.backButton[":hover"])
          }
          onMouseOut={(e) =>
            Object.assign(e.target.style, {
              backgroundColor: "#5a67d8",
              transform: "none",
              boxShadow: "none",
            })
          }
          onMouseDown={(e) =>
            Object.assign(e.target.style, styles.backButton[":active"])
          }
          onMouseUp={(e) =>
            Object.assign(e.target.style, { transform: "translateY(-2px)" })
          }
        >
          Sipariş Listesine Dön
        </button>
      </div>
      {order ? (
        <div style={styles.card}>
          <h2
            style={{
              fontSize: isMobile ? "20px" : "24px",
              color: "#1a202c",
              marginBottom: "20px",
            }}
          >
            Sipariş #{order.id}
          </h2>
          <div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Sipariş ID:</span>
              <span style={styles.infoValue}>{order.id || "Bilinmiyor"}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Tarih:</span>
              <span style={styles.infoValue}>
                {formatDate(order.date) || "N/A"}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Şehir:</span>
              <span style={styles.infoValue}>{order.city || "Bilinmiyor"}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Durum:</span>
              <span style={styles.infoValue}>{order.status || "N/A"}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Müşteri Adı:</span>
              <span style={styles.infoValue}>
                {order.customer?.username || "Bilinmiyor"}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Ürün Adı:</span>
              <span style={styles.infoValue}>
                {order.product?.name || "Bilinmiyor"}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Ürün Fiyatı:</span>
              <span style={styles.infoValue}>
                {order.product?.price
                  ? `$${order.product.price.toFixed(2)}`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p style={styles.empty}>Sipariş bulunamadı.</p>
      )}
    </div>
  );
};

export default OrderDetail;
