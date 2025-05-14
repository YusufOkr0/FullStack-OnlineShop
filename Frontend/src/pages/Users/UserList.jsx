import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ErrorComponent from "../ErrorComponent";
import styles from "../../components/css/Users/userListStyle";

const UserList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get("/customers");
        setUsers(userResponse.data);
      } catch (err) {
        setError({
          status: err.response?.status || null,
          message: err.response?.data?.message || "Kullanıcılar yüklenemedi.",
          errorMessage: err.response?.data?.error || "Bir Hata Oluştu",
        });
        console.error("Fetch users error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      setError({
        status: err.response?.status || null,
        message:
          err.response?.data?.message || "Kullanıcı silinirken hata oluştu.",
        errorMessage: err.response?.data?.error || "Bir Hata Oluştu",
      });
      console.error("Delete user error:", err);
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
        <h2 style={styles.title}>Kullanıcı Listesi</h2>
        {user?.role === "ADMIN" && (
          <Link to="/users/add">
            <button style={styles.addButton}>Kullanıcı Ekle</button>
          </Link>
        )}
      </div>

      <div style={styles.cards}>
        {users.length > 0 ? (
          users.map((user) => (
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
                {user?.role === "ADMIN" && (
                  <>
                    <Link
                      to={`/users/${user.id}/edit`}
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
                      onClick={() => openDeleteModal(user.id)}
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
          <p style={styles.loading}>Kullanıcı bulunamadı.</p>
        )}
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
