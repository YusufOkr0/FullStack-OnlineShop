import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const OrderList = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false); // Yeni: PDF yükleme durumu

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        console.log("Order data:", response.data);
        setOrders(response.data);
      } catch (err) {
        setError("Siparişler yüklenirken hata oluştu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      setOrders(orders.filter((order) => order.id !== id));
    } catch (err) {
      setError("Sipariş silinirken hata oluştu.");
      console.error(err);
    }
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

  // Animasyonlar
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

  // Yükleniyor durumu
  if (loading) return <p style={styles.loading}>Yükleniyor...</p>;

  // Hata durumu
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Sipariş Listesi</h2>
      </div>
      {orders.length > 0 ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Sipariş ID</th>
                <th style={styles.tableHeader}>Müşteri Adı</th>
                <th style={styles.tableHeader}>Ürün Adı</th>
                <th style={styles.tableHeader}>Durum</th>
                <th style={styles.tableHeader}>Eylemler</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{order.id}</td>
                  <td style={styles.tableCell}>
                    {order.customer?.username || "Bilinmiyor"}
                  </td>
                  <td style={styles.tableCell}>
                    {order.product?.name || "Bilinmiyor"}
                  </td>
                  <td style={styles.tableCell}>{order.status || "N/A"}</td>
                  <td style={styles.tableCell}>
                    <Link
                      to={`/orders/${order.id}`}
                      style={{ ...styles.actionButton, ...styles.detailButton }}
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
                    </Link>
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
                    {user && user.role === "ADMIN" && (
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
        <p style={styles.empty}>Sipariş bulunamadı.</p>
      )}
    </div>
  );
};

export default OrderList;
