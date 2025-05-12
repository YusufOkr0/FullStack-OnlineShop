import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("https://via.placeholder.com/150");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false); // Yeni: PDF yükleme durumu

  useEffect(() => {
    if (!user) {
      setError("Kullanıcı oturumu bulunamadı.");
      setLoading(false);
      return;
    }

    try {
      if (user.orders && Array.isArray(user.orders)) {
        setOrders(user.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError("Siparişler yüklenirken hata oluştu.");
      console.error("Error setting orders:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/orders/deleteById/${id}`);
      setOrders(orders.filter((order) => order.id !== id));
    } catch (err) {
      setError("Sipariş silinirken hata oluştu.");
      console.error("Delete order error:", err);
    }
  };

  const handleOpenPopup = async (order) => {
    setSelectedOrder(order);
    setPhotoLoading(true);
    try {
      const response = await api.get(`/products/${order.product.id}/image`, {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      setPhotoUrl(imageUrl);
    } catch (err) {
      console.error("Photo fetch error:", err);
      setPhotoUrl("https://via.placeholder.com/150");
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleClosePopup = () => {
    setSelectedOrder(null);
    setPhotoUrl("https://via.placeholder.com/150");
  };

  // Yeni: Fiş görüntüleme/indirme fonksiyonu
  const handleViewReceipt = async (orderId) => {
    setPdfLoading(true);
    try {
      const response = await api.get(`/orders/${orderId}/receipt`, {
        responseType: "blob",
      });
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // PDF'yi tarayıcıda yeni sekmede aç
      window.open(pdfUrl, "_blank");

      // Alternatif: PDF'yi indirmek için
      /*
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `order_receipt_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
      */
    } catch (err) {
      setError("Fiş yüklenirken hata oluştu.");
      console.error("Receipt fetch error:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  // Responsive inline stiller
  const isMobile = window.innerWidth <= 768;

  const styles = {
    container: {
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)",
      padding: isMobile ? "16px" : "24px",
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
      maxWidth: "1280px",
      marginBottom: isMobile ? "16px" : "24px",
      animation: "fadeIn 0.5s ease-in-out",
    },
    title: {
      fontSize: isMobile ? "24px" : "32px",
      color: "#111827",
      fontWeight: "700",
      marginBottom: isMobile ? "12px" : "0",
      letterSpacing: "-0.5px",
    },
    tableContainer: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      padding: isMobile ? "16px" : "24px",
      width: "100%",
      maxWidth: "1280px",
      animation: "fadeIn 0.5s ease-in-out",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: isMobile ? "14px" : "15px",
    },
    tableHeader: {
      backgroundColor: "#f9fafb",
      color: "#111827",
      fontWeight: "600",
      textAlign: "left",
      padding: isMobile ? "8px" : "10px",
      borderBottom: "1px solid #e5e7eb",
    },
    tableRow: {
      borderBottom: "1px solid #e5e7eb",
      transition: "background-color 0.2s ease",
    },
    tableCell: {
      padding: isMobile ? "8px" : "10px",
      color: "#374151",
      verticalAlign: "middle",
    },
    actionButton: {
      padding: isMobile ? "6px 12px" : "8px 16px",
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: "500",
      fontFamily: "'Inter', sans-serif",
      textDecoration: "none",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      color: "#ffffff",
      margin: isMobile ? "4px 0" : "0 4px",
    },
    detailButton: {
      background: "linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)",
    },
    deleteButton: {
      background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
    },
    receiptButton: {
      // Yeni: Fiş butonu için stil
      background: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)", // Sarı tonlu gradient
    },
    loading: {
      textAlign: "center",
      fontSize: isMobile ? "14px" : "16px",
      color: "#374151",
      marginTop: "40px",
      animation: "fadeIn 0.5s ease-in-out",
    },
    error: {
      textAlign: "center",
      fontSize: isMobile ? "14px" : "16px",
      color: "#dc2626",
      backgroundColor: "#fef2f2",
      padding: "10px",
      borderRadius: "6px",
      marginTop: "40px",
      maxWidth: "500px",
      width: "100%",
      animation: "fadeIn 0.5s ease-in-out",
    },
    empty: {
      textAlign: "center",
      fontSize: isMobile ? "14px" : "16px",
      color: "#374151",
      marginTop: "40px",
      animation: "fadeIn 0.5s ease-in-out",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(3px)",
      WebkitBackdropFilter: "blur(3px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      animation: "fadeInOverlay 0.3s ease-in-out",
    },
    modalContent: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: isMobile ? "16px" : "24px",
      width: isMobile ? "90%" : "800px",
      maxHeight: "80vh",
      overflowY: "auto",
      boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
      animation: "slideIn 0.3s ease-in-out",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "16px" : "24px",
      position: "relative",
    },
    closeButton: {
      position: "absolute",
      top: isMobile ? "12px" : "16px",
      right: isMobile ? "12px" : "16px",
      backgroundColor: "#e5e7eb",
      border: "none",
      borderRadius: "50%",
      width: "28px",
      height: "28px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "16px",
      cursor: "pointer",
      color: "#374151",
      transition: "all 0.2s ease",
    },
    modalImageContainer: {
      flex: isMobile ? "none" : "0 0 280px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: isMobile ? "100%" : "280px",
      height: isMobile ? "200px" : "280px",
      backgroundColor: "#f9fafb",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    modalImage: {
      width: isMobile ? "100%" : "260px",
      height: isMobile ? "auto" : "260px",
      objectFit: "contain",
      borderRadius: "8px",
      transition: "transform 0.3s ease",
    },
    modalInfoContainer: {
      flex: isMobile ? "none" : "1",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    modalTitle: {
      fontSize: isMobile ? "20px" : "24px",
      color: "#111827",
      fontWeight: "700",
      marginBottom: "12px",
      letterSpacing: "-0.5px",
    },
    modalInfo: {
      fontSize: isMobile ? "13px" : "14px",
      color: "#374151",
      padding: "6px 0",
      borderBottom: "1px solid #f3f4f6",
      display: "flex",
      justifyContent: "space-between",
      lineHeight: "1.4",
    },
    modalInfoLabel: {
      fontWeight: "600",
      color: "#1f2a44",
      flex: "0 0 35%",
    },
    modalInfoValue: {
      flex: "1",
      textAlign: "right",
      color: "#374151",
    },
  };

  // Hover ve Aktif Efektler
  styles.detailButton[":hover"] = {
    background: "linear-gradient(135deg, #4338ca 0%, #5b21b6 100%)",
    transform: "translateY(-1px)",
    boxShadow: "0 3px 8px rgba(79, 70, 229, 0.3)",
  };
  styles.detailButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };
  styles.deleteButton[":hover"] = {
    background: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
    transform: "translateY(-1px)",
    boxShadow: "0 3px 8px rgba(220, 38, 38, 0.3)",
  };
  styles.deleteButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };
  styles.receiptButton[":hover"] = {
    // Yeni: Fiş butonu hover efekti
    background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    transform: "translateY(-1px)",
    boxShadow: "0 3px 8px rgba(234, 179, 8, 0.3)",
  };
  styles.receiptButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };
  styles.tableRow[":hover"] = {
    backgroundColor: "#f9fafb",
  };
  styles.closeButton[":hover"] = {
    backgroundColor: "#d1d5db",
    color: "#111827",
  };
  styles.modalImage[":hover"] = {
    transform: "scale(1.03)",
  };

  // Animasyonlar
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeInOverlay {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
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
        <h2 style={styles.title}>Siparişlerim</h2>
      </div>
      {orders.length > 0 ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Sipariş ID</th>
                <th style={styles.tableHeader}>Ürün Adı</th>
                <th style={styles.tableHeader}>Ürün Fiyatı</th>
                <th style={styles.tableHeader}>Durum</th>
                <th style={styles.tableHeader}>Eylemler</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{order.id}</td>
                  <td style={styles.tableCell}>
                    {order.product?.name || "Bilinmiyor"}
                  </td>
                  <td style={styles.tableCell}>
                    {order.product?.price
                      ? `$${order.product.price.toFixed(2)}`
                      : "N/A"}
                  </td>
                  <td style={styles.tableCell}>{order.status || "N/A"}</td>
                  <td style={styles.tableCell}>
                    <button
                      style={{ ...styles.actionButton, ...styles.detailButton }}
                      onClick={() => handleOpenPopup(order)}
                      onMouseOver={(e) =>
                        Object.assign(
                          e.target.style,
                          styles.detailButton[":hover"]
                        )
                      }
                      onMouseOut={(e) =>
                        Object.assign(e.target.style, {
                          background: styles.detailButton.background,
                          transform: "none",
                          boxShadow: "none",
                        })
                      }
                      onMouseDown={(e) =>
                        Object.assign(
                          e.target.style,
                          styles.detailButton[":active"]
                        )
                      }
                      onMouseUp={(e) =>
                        Object.assign(e.target.style, {
                          transform: "translateY(-1px)",
                        })
                      }
                    >
                      Detay
                    </button>
                    {user.role === "ADMIN" && (
                      <button
                        style={{
                          ...styles.actionButton,
                          ...styles.receiptButton,
                        }}
                        onClick={() => handleViewReceipt(order.id)}
                        disabled={pdfLoading}
                        onMouseOver={(e) =>
                          Object.assign(
                            e.target.style,
                            styles.receiptButton[":hover"]
                          )
                        }
                        onMouseOut={(e) =>
                          Object.assign(e.target.style, {
                            background: styles.receiptButton.background,
                            transform: "none",
                            boxShadow: "none",
                          })
                        }
                        onMouseDown={(e) =>
                          Object.assign(
                            e.target.style,
                            styles.receiptButton[":active"]
                          )
                        }
                        onMouseUp={(e) =>
                          Object.assign(e.target.style, {
                            transform: "translateY(-1px)",
                          })
                        }
                      >
                        {"Fiş Görüntüle"}
                      </button>
                    )}
                    {user && (
                      <button
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton,
                        }}
                        onClick={() => handleDelete(order.id)}
                        onMouseOver={(e) =>
                          Object.assign(
                            e.target.style,
                            styles.deleteButton[":hover"]
                          )
                        }
                        onMouseOut={(e) =>
                          Object.assign(e.target.style, {
                            background: styles.deleteButton.background,
                            transform: "none",
                            boxShadow: "none",
                          })
                        }
                        onMouseDown={(e) =>
                          Object.assign(
                            e.target.style,
                            styles.deleteButton[":active"]
                          )
                        }
                        onMouseUp={(e) =>
                          Object.assign(e.target.style, {
                            transform: "translateY(-1px)",
                          })
                        }
                      >
                        Sil
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={styles.empty}>Henüz siparişiniz yok.</p>
      )}

      {/* Popup (Modal) */}
      {selectedOrder && (
        <div style={styles.modalOverlay} onClick={handleClosePopup}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              style={styles.closeButton}
              onClick={handleClosePopup}
              onMouseOver={(e) =>
                Object.assign(e.target.style, styles.closeButton[":hover"])
              }
              onMouseOut={(e) =>
                Object.assign(e.target.style, {
                  backgroundColor: "#e5e7eb",
                  color: "#374151",
                })
              }
            >
              ×
            </button>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "16px" : "24px",
              }}
            >
              <div style={styles.modalImageContainer}>
                {photoLoading ? (
                  <p style={styles.loading}>Fotoğraf yükleniyor...</p>
                ) : (
                  <img
                    src={photoUrl}
                    alt={selectedOrder.product?.name || "Ürün"}
                    style={styles.modalImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                )}
              </div>
              <div style={styles.modalInfoContainer}>
                <h3 style={styles.modalTitle}>Sipariş Detayları</h3>
                <p style={styles.modalInfo}>
                  <span style={styles.modalInfoLabel}>Sipariş ID:</span>
                  <span style={styles.modalInfoValue}>{selectedOrder.id}</span>
                </p>
                <p style={styles.modalInfo}>
                  <span style={styles.modalInfoLabel}>Ürün Adı:</span>
                  <span style={styles.modalInfoValue}>
                    {selectedOrder.product?.name || "Bilinmiyor"}
                  </span>
                </p>
                <p style={styles.modalInfo}>
                  <span style={styles.modalInfoLabel}>Ürün Fiyatı:</span>
                  <span style={styles.modalInfoValue}>
                    {selectedOrder.product?.price
                      ? `$${selectedOrder.product.price.toFixed(2)}`
                      : "N/A"}
                  </span>
                </p>
                <p style={styles.modalInfo}>
                  <span style={styles.modalInfoLabel}>Sipariş Tarihi:</span>
                  <span style={styles.modalInfoValue}>
                    {selectedOrder.date
                      ? new Date(selectedOrder.date).toLocaleString()
                      : "N/A"}
                  </span>
                </p>
                <p style={styles.modalInfo}>
                  <span style={styles.modalInfoLabel}>Şehir:</span>
                  <span style={styles.modalInfoValue}>
                    {selectedOrder.city || "N/A"}
                  </span>
                </p>
                <p style={styles.modalInfo}>
                  <span style={styles.modalInfoLabel}>Durum:</span>
                  <span style={styles.modalInfoValue}>
                    {selectedOrder.status || "N/A"}
                  </span>
                </p>
                {selectedOrder.product?.category && (
                  <p style={styles.modalInfo}>
                    <span style={styles.modalInfoLabel}>Kategori:</span>
                    <span style={styles.modalInfoValue}>
                      {selectedOrder.product.category}
                    </span>
                  </p>
                )}
                {selectedOrder.product?.supplier && (
                  <p style={styles.modalInfo}>
                    <span style={styles.modalInfoLabel}>Tedarikçi:</span>
                    <span style={styles.modalInfoValue}>
                      {selectedOrder.product.supplier}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
