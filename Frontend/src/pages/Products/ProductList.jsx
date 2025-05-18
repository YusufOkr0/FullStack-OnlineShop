import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import api from "../../services/api";
import {useAuth} from "../../context/AuthContext";
import ErrorComponent from "../ErrorComponent";
import styles from "../../components/css/Products/ProductListStyle";

const ProductList = () => {
    const {user} = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                console.log(response.data);
                setProducts(response.data);
            } catch (err) {
                setError({
                    status: err.response?.data?.status || null,
                    message: err.response?.data?.message || "Could not load products.", // Translated
                    errorMessage: err.response?.data?.error || "An Error Occurred", // Translated
                });
                console.error("Fetch products error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const openDeleteModal = (id) => {
        setSelectedProductId(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProductId(null);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/products/deleteById/${selectedProductId}`);
            setProducts(
                products.filter((product) => product.id !== selectedProductId)
            );
            closeModal();
        } catch (err) {
            setError({
                status: err.response?.data.status || null,
                message: err.response?.data?.message || "An error occurred while deleting the product.", // Translated
                errorMessage: err.response?.data?.error || "An Error Occurred", // Translated
            });
            console.error("Delete product error:", err);
            closeModal();
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

    if (loading) return <p style={styles.loading}>Loading...</p>; // Translated
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
                <h2 style={styles.title}>Product List</h2> {/* Translated */}
                {user && user.role === "ADMIN" && (
                    <Link to="/products/new">
                        <button style={styles.addButton}>Add Product</button>
                        {/* Translated */}
                    </Link>
                )}
            </div>

            <div style={styles.cards}>
                {products.length > 0 ? (
                    products.map((product) => (
                        <div
                            key={product.id}
                            style={styles.card}
                            onMouseOver={(e) =>
                                Object.assign(e.currentTarget.style, styles.cardHover)
                            }
                            onMouseOut={(e) =>
                                Object.assign(e.currentTarget.style, {
                                    transform: "none",
                                    boxShadow: styles.card.boxShadow,
                                })
                            }
                        >
                            <h3 style={styles.cardTitle}>{product.name}</h3>
                            <p style={styles.cardText}>
                                <strong>Supplier:</strong> {product.supplier} {/* Translated */}
                            </p>
                            <p style={styles.cardText}>
                                <strong>Price:</strong> ${product.price.toFixed(2)} {/* Translated */}
                            </p>
                            <div style={styles.cardActions}>
                                <Link
                                    to={`/products/${product.id}`}
                                    style={{...styles.actionButton, ...styles.detailButton}}
                                    onMouseOver={(e) =>
                                        Object.assign(e.target.style, styles.detailButton[":hover"])
                                    }
                                    onMouseOut={(e) =>
                                        Object.assign(e.target.style, {
                                            backgroundColor: styles.detailButton.backgroundColor,
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
                                            transform: "translateY(-2px)",
                                        })
                                    }
                                >
                                    Details {/* Translated */}
                                </Link>
                                {user && user.role === "ADMIN" && (
                                    <>
                                        <Link
                                            to={`/products/${product.id}/edit`}
                                            style={{...styles.actionButton, ...styles.updateButton}}
                                            onMouseOver={(e) =>
                                                Object.assign(
                                                    e.target.style,
                                                    styles.updateButton[":hover"]
                                                )
                                            }
                                            onMouseOut={(e) =>
                                                Object.assign(e.target.style, {
                                                    backgroundColor: styles.updateButton.backgroundColor,
                                                    transform: "none",
                                                    boxShadow: "none",
                                                })
                                            }
                                            onMouseDown={(e) =>
                                                Object.assign(
                                                    e.target.style,
                                                    styles.updateButton[":active"]
                                                )
                                            }
                                            onMouseUp={(e) =>
                                                Object.assign(e.target.style, {
                                                    transform: "translateY(-2px)",
                                                })
                                            }
                                        >
                                            Update {/* Translated */}
                                        </Link>
                                        <button
                                            style={{...styles.actionButton, ...styles.deleteButton}}
                                            onClick={() => openDeleteModal(product.id)}
                                            onMouseOver={(e) =>
                                                Object.assign(
                                                    e.target.style,
                                                    styles.deleteButton[":hover"]
                                                )
                                            }
                                            onMouseOut={(e) =>
                                                Object.assign(e.target.style, {
                                                    backgroundColor: styles.deleteButton.backgroundColor,
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
                                                    transform: "translateY(-2px)",
                                                })
                                            }
                                        >
                                            Delete {/* Translated */}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={styles.loading}>No products found.</p> // Translated
                )}
            </div>

            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Delete Product</h3> {/* Translated */}
                        <p style={styles.modalText}>
                            Are you sure you want to delete this product? This action cannot be
                            undone. {/* Translated */}
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
                                        backgroundColor: styles.confirmButton.backgroundColor,
                                        transform: "none",
                                        boxShadow: "none",
                                    })
                                }
                                onMouseDown={(e) =>
                                    Object.assign(e.target.style, styles.confirmButton[":active"])
                                }
                                onMouseUp={(e) =>
                                    Object.assign(e.target.style, {
                                        transform: "translateY(-2px)",
                                    })
                                }
                            >
                                Yes, Delete {/* Translated */}
                            </button>
                            <button
                                style={{...styles.modalButton, ...styles.cancelButton}}
                                onClick={closeModal}
                                onMouseOver={(e) =>
                                    Object.assign(e.target.style, styles.cancelButton[":hover"])
                                }
                                onMouseOut={(e) =>
                                    Object.assign(e.target.style, {
                                        backgroundColor: styles.cancelButton.backgroundColor,
                                        transform: "none",
                                        boxShadow: "none",
                                    })
                                }
                                onMouseDown={(e) =>
                                    Object.assign(e.target.style, styles.cancelButton[":active"])
                                }
                                onMouseUp={(e) =>
                                    Object.assign(e.target.style, {
                                        transform: "translateY(-2px)",
                                    })
                                }
                            >
                                Cancel {/* Translated */}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;