import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import api from "../../services/api";
import {useAuth} from "../../context/AuthContext";
import ErrorComponent from "../ErrorComponent";
import styles from "../../components/css/Orders/OrderListStyle";

const OrderList = () => {
    const {user} = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get("/orders");
                console.log("Order data:", response.data);
                setOrders(response.data);
            } catch (err) {
                setError({
                    status: err.response?.data?.status || null,
                    message:
                        err.response?.data?.message ||
                        "An error occurred while loading orders.",
                    errorMessage: err.response?.data?.error,
                });
                console.error("Fetch orders error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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
            await api.delete(`/orders/${orderToDelete}`);
            setOrders(orders.filter((order) => order.id !== orderToDelete));
            closeDeleteModal();
        } catch (err) {
            setError({
                status: err.response?.data?.status || null,
                message:
                    err.response?.data?.message || "An error occurred while deleting the order.",
                errorMessage: err.response?.data?.error || "An Error Occurred",
            });
            console.error("Delete order error:", err);
            closeDeleteModal();
        }
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
                status: err.response?.data.status || null,
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
                <h2 style={styles.title}>Order List</h2>
            </div>
            {orders.length > 0 ? (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.tableHeader}>Order ID</th>
                            <th style={styles.tableHeader}>Customer Name</th>
                            <th style={styles.tableHeader}>Product Name</th>
                            <th style={styles.tableHeader}>Status</th>
                            <th style={styles.tableHeader}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} style={styles.tableRow}>
                                <td style={styles.tableCell}>{order.id}</td>
                                <td style={styles.tableCell}>
                                    {order.customer?.username || "Unknown"}
                                </td>
                                <td style={styles.tableCell}>
                                    {order.product?.name || "Unknown"}
                                </td>
                                <td style={styles.tableCell}>{order.status || "N/A"}</td>
                                <td style={styles.tableCell}>
                                    <Link
                                        to={`/orders/${order.id}`}
                                        style={{...styles.actionButton, ...styles.detailButton}}
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
                                        View Receipt
                                    </button>
                                    {user && user.role === "ADMIN" && (
                                        <button
                                            style={{
                                                ...styles.actionButton,
                                                ...styles.deleteButton,
                                            }}
                                            onClick={() => openDeleteModal(order.id)}
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
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p style={styles.empty}>No orders found.</p>
            )}

            {showDeleteModal && (
                <div style={styles.modalOverlay} onClick={closeDeleteModal}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 style={styles.modalTitle}>Siparişi Sil</h3>
                        <p style={styles.modalText}>
                            Bu siparişi silmek istediğinizden emin misiniz? Bu işlem geri
                            alınamaz.
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
                                Evet, Sil
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
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
