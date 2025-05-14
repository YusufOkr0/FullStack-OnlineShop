import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ErrorComponent from "../ErrorComponent";
import styles from "../../components/css/Products/ProductListStyle";

const ProductList = () => {
  const { user } = useAuth();
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
          message: err.response?.data?.message || "Ürünler yüklenemedi.",
          errorMessage: err.response?.data?.error || "Bir Hata Oluştu",
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
        message: err.response?.data?.message || "Ürün silinirken hata oluştu.",
        errorMessage: err.response?.data?.error || "Bir Hata Oluştu",
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
        <h2 style={styles.title}>Ürün Listesi</h2>
        {user && user.role === "ADMIN" && (
          <Link to="/products/new">
            <button style={styles.addButton}>Ürün Ekle</button>
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
                <strong>Tedarikçi:</strong> {product.supplier}
              </p>
              <p style={styles.cardText}>
                <strong>Fiyat:</strong> ${product.price.toFixed(2)}
              </p>
              <div style={styles.cardActions}>
                <Link
                  to={`/products/${product.id}`}
                  style={{ ...styles.actionButton, ...styles.detailButton }}
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
                  Detay
                </Link>
                {user && user.role === "ADMIN" && (
                  <>
                    <Link
                      to={`/products/${product.id}/edit`}
                      style={{ ...styles.actionButton, ...styles.updateButton }}
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
                      Güncelle
                    </Link>
                    <button
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
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
                      Sil
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={styles.loading}>Ürün bulunamadı.</p>
        )}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Ürünü Sil</h3>
            <p style={styles.modalText}>
              Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </p>
            <div style={styles.modalButtons}>
              <button
                style={{ ...styles.modalButton, ...styles.confirmButton }}
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
                Evet, Sil
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.cancelButton }}
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
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
