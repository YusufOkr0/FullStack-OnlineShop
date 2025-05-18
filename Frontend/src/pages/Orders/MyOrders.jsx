import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import api from "../../services/api";
import ErrorComponent from "../ErrorComponent";
import styles from "../../components/css/Orders/MyOrdersStyle";

const MyOrders = () => {
    const {user} = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [photoUrl, setPhotoUrl] = useState("https://via.placeholder.com/150");
    const [photoLoading, setPhotoLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    useEffect(() => {
        if (!user) {
            setError({
                status: 401,
                message: "User session not found.",
                errorMessage: "Unauthorized",
            });
            setLoading(false);
            return;
        }

        try {
            if (user.orders && Array.isArray(user.orders)) {
                setOrders(user.orders);
            } else {
                setError({
                    status: null,
                    message: "Orders not found.",
                    errorMessage: null,
                });
                setOrders([]);
            }
        } catch (err) {
            setError({
                status: err.response?.data.status || null,
                message:
                    err.response?.data?.message || "An error occurred while loading orders.",
                errorMessage: err.response?.data?.error || "An error has occurred.",
            });
            console.error("Error setting orders:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const openDeleteModal = (id) => {
        setOrderToDelete(id);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setOrderToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/orders/deleteById/${orderToDelete}`);
            setOrders(orders.filter((order) => order.id !== orderToDelete));
            closeDeleteModal();
        } catch (err) {
            setError({
                status: err.response?.data.status || null,
                message:
                    err.response?.data?.data.message || "An error occurred while deleting the order.",
                errorMessage: err.response?.data?.error || "An error has occurred.",
            });
            console.error("Delete order error:", err);
            closeDeleteModal();
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
            setError({
                status: err.response?.status || null,
                message:
                    err.response?.data?.message ||
                    "An error occurred while uploading the product photo.",
                errorMessage: err.response?.data?.error || "An error has occurred.",
            });
            setPhotoUrl("https://via.placeholder.com/150");
            console.error("Photo fetch error:", err);
        } finally {
            setPhotoLoading(false);
        }
    };

    const handleClosePopup = () => {
        setSelectedOrder(null);
        setPhotoUrl("https://via.placeholder.com/150");
    };

    const handleViewReceipt = async (orderId) => {
        setPdfLoading(true);
        try {
            const response = await api.get(`/orders/${orderId}/receipt`, {
                responseType: "blob",
            });
            const pdfBlob = new Blob([response.data], {type: "application/pdf"});
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, "_blank");
        } catch (err) {
            setError({
                status: err.response?.status || null,
                message: err.response?.data?.message || "An error occurred while loading the receipt.",
            });
            console.error("Receipt fetch error:", err);
        } finally {
            setPdfLoading(false);
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
    const isMobile = window.innerWidth <= 768;

    if (loading) return <p style={styles.loading}>Loading...</p>;
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
                <h2 style={styles.title}>My Orders</h2>
            </div>
            {orders.length > 0 ? (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.tableHeader}>Order ID</th>
                            <th style={styles.tableHeader}>Product Name</th>
                            <th style={styles.tableHeader}>Product Price</th>
                            <th style={styles.tableHeader}>Order Status</th>
                            <th style={styles.tableHeader}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} style={styles.tableRow}>
                                <td style={styles.tableCell}>{order.id}</td>
                                <td style={styles.tableCell}>
                                    {order.product?.name || "Unknown"}
                                </td>
                                <td style={styles.tableCell}>
                                    {order.product?.price
                                        ? `$${order.product.price.toFixed(2)}`
                                        : "N/A"}
                                </td>
                                <td style={styles.tableCell}>{order.status || "N/A"}</td>
                                <td style={styles.tableCell}>
                                    <button
                                        style={{...styles.actionButton, ...styles.detailButton}}
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
                                        Details
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
                                            {"View Receipt"}
                                        </button>
                                    )}
                                    {user && order.status !== "DELIVERED" && (
                                        <button
                                            style={{
                                                ...styles.actionButton,
                                                ...styles.deleteButton,
                                            }}
                                            onClick={() => openDeleteModal(order.id)}
                                            onMouseOver={(e) =>
                                                Object.assign(e.target.style, styles.deleteButton[":hover"])
                                            }
                                            onMouseOut={(e) =>
                                                Object.assign(e.target.style, {
                                                    background: styles.deleteButton.background,
                                                    transform: "none",
                                                    boxShadow: "none",
                                                })
                                            }
                                            onMouseDown={(e) =>
                                                Object.assign(e.target.style, styles.deleteButton[":active"])
                                            }
                                            onMouseUp={(e) =>
                                                Object.assign(e.target.style, {
                                                    transform: "translateY(-1px)",
                                                })
                                            }
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p style={styles.empty}>You don't have any orders yet.</p>
            )}

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
                                    <p style={styles.loading}>Photo loading...</p>
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
                                <h3 style={styles.modalTitle}>Order Details</h3>
                                <p style={styles.modalInfo}>
                                    <span style={styles.modalInfoLabel}>Order ID:</span>
                                    <span style={styles.modalInfoValue}>{selectedOrder.id}</span>
                                </p>
                                <p style={styles.modalInfo}>
                                    <span style={styles.modalInfoLabel}>Product Name:</span>
                                    <span style={styles.modalInfoValue}>
                    {selectedOrder.product?.name || "Unknown"}
                  </span>
                                </p>
                                <p style={styles.modalInfo}>
                                    <span style={styles.modalInfoLabel}>Product Price:</span>
                                    <span style={styles.modalInfoValue}>
                    {selectedOrder.product?.price
                        ? `$${selectedOrder.product.price.toFixed(2)}`
                        : "N/A"}
                  </span>
                                </p>
                                <p style={styles.modalInfo}>
                                    <span style={styles.modalInfoLabel}>Order date:</span>
                                    <span style={styles.modalInfoValue}>
                    {selectedOrder.date
                        ? new Date(selectedOrder.date).toLocaleString()
                        : "N/A"}
                  </span>
                                </p>
                                <p style={styles.modalInfo}>
                                    <span style={styles.modalInfoLabel}>Address:</span>
                                    <span style={styles.modalInfoValue}>
                    {selectedOrder.city || "N/A"}
                  </span>
                                </p>
                                <p style={styles.modalInfo}>
                                    <span style={styles.modalInfoLabel}>Order Status:</span>
                                    <span style={styles.modalInfoValue}>
                    {selectedOrder.status || "N/A"}
                  </span>
                                </p>
                                {selectedOrder.product?.supplier && (
                                    <p style={styles.modalInfo}>
                                        <span style={styles.modalInfoLabel}>Supplier:</span>
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

            {showDeleteModal && (
                <div style={styles.modalOverlay} onClick={closeDeleteModal}>
                    <div
                        style={{...styles.modalContent, ...styles.modalContentSmall}}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={styles.modalTitle}>Cansel order</h3>
                        <p style={styles.modalText}>
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>
                        <div style={styles.modalButtons}>
                            <button
                                style={{...styles.modalButton, ...styles.confirmButton}}
                                onClick={handleDelete}
                                onMouseOver={(e) =>
                                    Object.assign(e.target.style, styles.confirmButton[":hover"])
                                }
                                onMouseOut={(e) =>
                                    Object.assign(e.target.style, {
                                        background: styles.confirmButton.background,
                                        transform: "none",
                                        boxShadow: "none",
                                    })
                                }
                                onMouseDown={(e) =>
                                    Object.assign(e.target.style, styles.confirmButton[":active"])
                                }
                                onMouseUp={(e) =>
                                    Object.assign(e.target.style, {
                                        transform: "translateY(-1px)",
                                    })
                                }
                            >
                                Yes,Cancel
                            </button>
                            <button
                                style={{...styles.modalButton, ...styles.cancelButton}}
                                onClick={closeDeleteModal}
                                onMouseOver={(e) =>
                                    Object.assign(e.target.style, styles.cancelButton[":hover"])
                                }
                                onMouseOut={(e) =>
                                    Object.assign(e.target.style, {
                                        background: styles.cancelButton.background,
                                        transform: "none",
                                        boxShadow: "none",
                                    })
                                }
                                onMouseDown={(e) =>
                                    Object.assign(e.target.style, styles.cancelButton[":active"])
                                }
                                onMouseUp={(e) =>
                                    Object.assign(e.target.style, {
                                        transform: "translateY(-1px)",
                                    })
                                }
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
