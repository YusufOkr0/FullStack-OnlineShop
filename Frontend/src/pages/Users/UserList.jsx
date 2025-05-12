import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const UserList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get("/customers");
        setUsers(userResponse.data);
        setUserRole(user.role);
      } catch (err) {
        setError("Kullanıcılar yüklenemedi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const openDeleteModal = (id) => {
    setSelectedUserId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUserId(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/customers/deleteById/${selectedUserId}`);
      setUsers(users.filter((user) => user.id !== selectedUserId));
      closeModal();
    } catch (err) {
      setError("Kullanıcı silinirken hata oluştu.");
      console.error(err);
      closeModal();
    }
  };

  // Responsive inline styles
  const isMobile = window.innerWidth <= 768;
  const styles = {
    container: {
      minHeight: "calc(100vh - 60px)", // Account for navbar
      width: "100%",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)",
      padding: isMobile ? "20px" : "40px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      top: 0,
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
      fontFamily: "'Inter', sans-serif",
      marginBottom: isMobile ? "15px" : "0",
    },
    addButton: {
      padding: isMobile ? "10px 20px" : "12px 24px",
      backgroundColor: "#5a67d8",
      color: "#ffffff",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      textDecoration: "none",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    cards: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      flexWrap: "wrap",
      gap: isMobile ? "20px" : "30px",
      justifyContent: "center",
      width: "100%",
      maxWidth: "1200px",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      padding: isMobile ? "20px" : "30px",
      width: isMobile ? "100%" : "300px",
      textAlign: "center",
      transition: "all 0.3s ease",
      animation: "fadeIn 0.5s ease-in-out",
    },
    cardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
    },
    cardTitle: {
      fontSize: isMobile ? "20px" : "24px",
      color: "#1a202c",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      marginBottom: "10px",
    },
    cardText: {
      fontSize: isMobile ? "14px" : "16px",
      color: "#4a5568",
      fontWeight: "400",
      fontFamily: "'Inter', sans-serif",
      marginBottom: "10px",
    },
    cardActions: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "10px" : "15px",
      justifyContent: "center",
      marginTop: "15px",
    },
    actionButton: {
      padding: isMobile ? "8px 16px" : "10px 20px",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      textDecoration: "none",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
      color: "#ffffff",
    },
    detailButton: {
      backgroundColor: "#5a67d8",
    },
    updateButton: {
      backgroundColor: "#f6ad55",
    },
    deleteButton: {
      backgroundColor: "#f56565",
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
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      animation: "fadeIn 0.3s ease-in-out",
    },
    modal: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: isMobile ? "20px" : "30px",
      maxWidth: isMobile ? "90%" : "400px",
      width: "100%",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
      fontFamily: "'Inter', sans-serif",
      animation: "fadeIn 0.3s ease-in-out",
    },
    modalTitle: {
      fontSize: isMobile ? "20px" : "24px",
      color: "#1a202c",
      fontWeight: "600",
      marginBottom: "15px",
    },
    modalText: {
      fontSize: isMobile ? "14px" : "16px",
      color: "#4a5568",
      marginBottom: "20px",
    },
    modalButtons: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "10px" : "15px",
      justifyContent: "center",
    },
    modalButton: {
      padding: isMobile ? "8px 16px" : "10px 20px",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
      color: "#ffffff",
    },
    confirmButton: {
      backgroundColor: "#f56565",
    },
    cancelButton: {
      backgroundColor: "#5a67d8",
    },
  };

  // Hover ve active efektleri
  styles.addButton[":hover"] = {
    backgroundColor: "#4c51bf",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
  };
  styles.addButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };
  styles.detailButton[":hover"] = {
    backgroundColor: "#4c51bf",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
  };
  styles.detailButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };
  styles.updateButton[":hover"] = {
    backgroundColor: "#ed9b40",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(246, 173, 85, 0.3)",
  };
  styles.updateButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };
  styles.deleteButton[":hover"] = {
    backgroundColor: "#e53e3e",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(245, 101, 101, 0.3)",
  };
  styles.deleteButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };
  styles.confirmButton[":hover"] = {
    backgroundColor: "#e53e3e",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(245, 101, 101, 0.3)",
  };
  styles.confirmButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };
  styles.cancelButton[":hover"] = {
    backgroundColor: "#4c51bf",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
  };
  styles.cancelButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };

  // Inject fadeIn animation
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

  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Kullanıcı Listesi</h2>
        {userRole === "ADMIN" && (
          <Link to="/users/add">
            <button style={styles.addButton}>Kullanıcı Ekle</button>
          </Link>
        )}
      </div>

      <div style={styles.cards}>
        {users.map((user) => (
          <div
            key={user.id}
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
            <h3 style={styles.cardTitle}>{user.username}</h3>
            <p style={styles.cardText}>
              <strong>Telefon:</strong> {user.phone}
            </p>
            <p style={styles.cardText}>
              <strong>Rol:</strong> {user.role}
            </p>
            <div style={styles.cardActions}>
              <Link
                to={`/users/${user.id}`}
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
                  Object.assign(e.target.style, styles.detailButton[":active"])
                }
                onMouseUp={(e) =>
                  Object.assign(e.target.style, {
                    transform: "translateY(-2px)",
                  })
                }
              >
                Detay
              </Link>
              <Link
                to={`/users/${user.id}/edit`}
                style={{ ...styles.actionButton, ...styles.updateButton }}
                onMouseOver={(e) =>
                  Object.assign(e.target.style, styles.updateButton[":hover"])
                }
                onMouseOut={(e) =>
                  Object.assign(e.target.style, {
                    backgroundColor: styles.updateButton.backgroundColor,
                    transform: "none",
                    boxShadow: "none",
                  })
                }
                onMouseDown={(e) =>
                  Object.assign(e.target.style, styles.updateButton[":active"])
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
                onClick={() => openDeleteModal(user.id)}
                onMouseOver={(e) =>
                  Object.assign(e.target.style, styles.deleteButton[":hover"])
                }
                onMouseOut={(e) =>
                  Object.assign(e.target.style, {
                    backgroundColor: styles.deleteButton.backgroundColor,
                    transform: "none",
                    boxShadow: "none",
                  })
                }
                onMouseDown={(e) =>
                  Object.assign(e.target.style, styles.deleteButton[":active"])
                }
                onMouseUp={(e) =>
                  Object.assign(e.target.style, {
                    transform: "translateY(-2px)",
                  })
                }
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Kullanıcıyı Sil</h3>
            <p style={styles.modalText}>
              Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri
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

export default UserList;
