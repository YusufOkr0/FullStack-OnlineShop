import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sipariş detaylarını almak
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        console.log("Order detail:", response.data);
        setOrder(response.data);
      } catch (err) {
        setError("Sipariş detayları alınırken bir hata oluştu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  // Tarih formatlama (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Geçersiz Tarih";
    return date.toISOString().split("T")[0];
  };

  // Responsive inline stiller
  const isMobile = window.innerWidth <= 768;
  const styles = {
    container: {
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)",
      padding: isMobile ? "20px" : "40px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      width: "100%",
      maxWidth: "1200px",
      marginBottom: isMobile ? "20px" : "30px",
      animation: "fadeIn 0.5s ease-in-out",
    },
    title: {
      fontSize: isMobile ? "28px" : "36px",
      color: "#1a202c",
      fontWeight: "700",
      marginBottom: isMobile ? "15px" : "0",
    },
    backButton: {
      padding: isMobile ? "10px 20px" : "12px 24px",
      backgroundColor: "#5a67d8",
      color: "#ffffff",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      textDecoration: "none",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      padding: isMobile ? "20px" : "30px",
      width: "100%",
      maxWidth: "600px",
      animation: "fadeIn 0.5s ease-in-out",
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: isMobile ? "10px 0" : "12px 0",
      borderBottom: "1px solid #e2e8f0",
      fontSize: isMobile ? "14px" : "16px",
      color: "#4a5568",
    },
    infoLabel: {
      fontWeight: "600",
      color: "#1a202c",
      flex: "1",
    },
    infoValue: {
      flex: "2",
      textAlign: "right",
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
      backgroundColor: "#fff5f5",
      padding: "12px",
      borderRadius: "8px",
      marginTop: "50px",
      animation: "fadeIn 0.5s ease-in-out",
      maxWidth: "600px",
      width: "100%",
    },
    empty: {
      textAlign: "center",
      fontSize: isMobile ? "16px" : "18px",
      color: "#4a5568",
      marginTop: "50px",
      animation: "fadeIn 0.5s ease-in-out",
    },
  };

  // Hover ve active efektleri
  styles.backButton[":hover"] = {
    backgroundColor: "#4c51bf",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
  };
  styles.backButton[":active"] = {
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
