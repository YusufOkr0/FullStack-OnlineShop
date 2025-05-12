import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const API_BASE_URL = "http://localhost:8080";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    address: "",
    phone: "",
    password: "",
    ...(id ? { role: "CUSTOMER" } : {}),
  });
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(
    "https://via.placeholder.com/150"
  );
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modal için otomatik kapanma ve yönlendirme
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        console.log("Navigating to /users from modal timeout");
        navigate("/users", { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  // Kullanıcı verilerini ve fotoğrafı çekme
  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/customers/${id}`);
          const { username, address, phone, role } = response.data;
          console.log("User data:", response.data);
          setFormData({
            username: username || "",
            address: address || "",
            phone: phone || "", // Backend’ten gelen formatta kalacak
            role: role || "CUSTOMER",
            password: "",
          });
        } catch (err) {
          setError("Kullanıcı verileri yüklenemedi.");
          console.error("Fetch user error:", err);
        }
      };

      const fetchPhoto = async () => {
        setPhotoLoading(true);
        try {
          const response = await api.get(`/customers/${id}/image`, {
            responseType: "blob",
          });
          const imageUrl = URL.createObjectURL(response.data);
          setCurrentPhotoUrl(imageUrl);
        } catch (err) {
          console.error("Photo fetch error:", err);
          setCurrentPhotoUrl("https://via.placeholder.com/150");
        } finally {
          setPhotoLoading(false);
        }
      };

      const loadData = async () => {
        await Promise.all([fetchUser(), fetchPhoto()]);
      };

      loadData();

      return () => {
        if (
          currentPhotoUrl &&
          currentPhotoUrl !== "https://via.placeholder.com/150"
        ) {
          URL.revokeObjectURL(currentPhotoUrl);
        }
      };
    }
  }, [id]);

  // FadeIn animasyonu
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes modalFadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Telefon numarasını formatlama (555-555-5555)
  const formatPhoneNumber = (value) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length > 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 3) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    return digits;
  };

  // Input değişikliklerini yönetme
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, phone: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Form gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted, preventing default behavior");
    setError(null);
    setSuccessMessage(null);

    // Client-side doğrulama
    if (
      !formData.username ||
      !formData.address ||
      !formData.phone ||
      (!id && !formData.password)
    ) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    if (formData.username.length > 16) {
      setError("Kullanıcı adı 16 karakterden kısa olmalıdır.");
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setError("Telefon numarası 10 rakam olmalı (555-555-5555 formatında).");
      return;
    }

    if (formData.address.length < 5) {
      setError("Adres en az 5 karakter olmalı.");
      return;
    }

    if (formData.address.length > 100) {
      setError("Adres 100 karakterden kısa olmalıdır.");
      return;
    }

    try {
      if (id) {
        // Güncelleme için multipart/form-data
        const updateData = new FormData();
        const updateCustomerRequest = {
          username: formData.username,
          address: formData.address,
          phone: formData.phone,
        };
        updateData.append(
          "updateCustomerRequest",
          new Blob([JSON.stringify(updateCustomerRequest)], {
            type: "application/json",
          })
        );

        await api.put(`/customers/updateById/${id}`, updateData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage("Kullanıcı başarıyla güncellendi!");
      } else {
        // Yeni kullanıcı oluşturma için JSON
        await api.post("/admin/add", {
          username: formData.username,
          phone: formData.phone,
          address: formData.address,
        });
        setSuccessMessage("Kullanıcı başarıyla oluşturuldu!");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        "Kullanıcı kaydedilirken bir hata oluştu.";
      setError(errorMessage);
      console.error("Submit error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
      console.error("Response headers:", err.response?.headers);
    }
  };

  // Modal kapatma ve yönlendirme
  const handleModalClose = () => {
    setSuccessMessage(null);
    console.log("Navigating to /users from modal close");
    navigate("/users", { replace: true });
  };

  // Responsive inline styles
  const isMobile = window.innerWidth <= 768;
  const styles = {
    container: {
      minHeight: "calc(100vh - 60px)",
      width: "100%",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)",
      padding: isMobile ? "20px" : "40px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Inter', sans-serif",
    },
    title: {
      fontSize: isMobile ? "28px" : "36px",
      color: "#1a202c",
      fontWeight: "700",
      fontFamily: "'Inter', sans-serif",
      marginBottom: isMobile ? "20px" : "30px",
      textAlign: "center",
      animation: "fadeIn 0.5s ease-in-out",
    },
    form: {
      maxWidth: "600px",
      width: "100%",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      padding: isMobile ? "20px" : "30px",
      animation: "fadeIn 0.5s ease-in-out",
    },
    photoContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: isMobile ? "15px" : "20px",
    },
    photo: {
      width: isMobile ? "120px" : "150px",
      height: isMobile ? "120px" : "150px",
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: "10px",
      border: "2px solid #dee2e6",
      backgroundColor: "#f8f9fa",
      transition: "transform 0.3s ease",
    },
    formGroup: {
      marginBottom: isMobile ? "15px" : "20px",
      textAlign: "left",
    },
    label: {
      fontSize: isMobile ? "14px" : "16px",
      color: "#1a202c",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      marginBottom: "8px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: isMobile ? "8px" : "10px",
      fontSize: isMobile ? "14px" : "16px",
      fontFamily: "'Inter', sans-serif",
      border: "1px solid #dee2e6",
      borderRadius: "8px",
      outline: "none",
      transition: "border-color 0.3s",
    },
    select: {
      width: "100%",
      padding: isMobile ? "8px" : "10px",
      fontSize: isMobile ? "14px" : "16px",
      fontFamily: "'Inter', sans-serif",
      border: "1px solid #dee2e6",
      borderRadius: "8px",
      outline: "none",
      backgroundColor: "#fff",
      transition: "border-color 0.3s",
    },
    submitButton: {
      padding: isMobile ? "10px 20px" : "12px 24px",
      backgroundColor: "#5a67d8",
      color: "#ffffff",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
      width: "100%",
      marginTop: "20px",
    },
    error: {
      textAlign: "center",
      fontSize: isMobile ? "14px" : "16px",
      color: "#f56565",
      marginBottom: "15px",
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
    },
    modalContent: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: isMobile ? "20px" : "30px",
      maxWidth: isMobile ? "90%" : "400px",
      width: "100%",
      textAlign: "center",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
      animation: "modalFadeIn 0.3s ease-in-out",
    },
    modalMessage: {
      fontSize: isMobile ? "16px" : "18px",
      color: "#28a745",
      marginBottom: "20px",
      fontFamily: "'Inter', sans-serif",
    },
    modalButton: {
      padding: isMobile ? "8px 16px" : "10px 20px",
      backgroundColor: "#5a67d8",
      color: "#ffffff",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
  };

  // Hover ve focus efektleri
  styles.photo[":hover"] = {
    transform: "scale(1.05)",
  };
  styles.input[":focus"] = {
    borderColor: "#5a67d8",
    boxShadow: "0 0 0 3px rgba(90, 103, 216, 0.1)",
  };
  styles.select[":focus"] = {
    borderColor: "#5a67d8",
    boxShadow: "0 0 0 3px rgba(90, 103, 216, 0.1)",
  };
  styles.submitButton[":hover"] = {
    backgroundColor: "#4c51bf",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
  };
  styles.submitButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };
  styles.submitButton[":disabled"] = {
    backgroundColor: "#a0aec0",
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "none",
  };
  styles.modalButton[":hover"] = {
    backgroundColor: "#4c51bf",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
  };
  styles.modalButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };

  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.title}>
          {id ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Oluştur"}
        </h2>
        <div style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit}>
            {/* Fotoğraf Bölümü (yalnızca düzenleme modunda) */}
            {id && (
              <div style={styles.photoContainer}>
                {photoLoading ? (
                  <p style={styles.loading}>Fotoğraf yükleniyor...</p>
                ) : (
                  <img
                    src={currentPhotoUrl}
                    alt="Profil"
                    style={styles.photo}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                )}
              </div>
            )}
            {/* Form Alanları */}
            <div style={styles.formGroup}>
              <label htmlFor="username" style={styles.label}>
                Kullanıcı Adı:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Kullanıcı adı girin"
                style={styles.input}
                required
                maxLength={16}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="address" style={styles.label}>
                Adres:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Adres girin"
                style={styles.input}
                required
                maxLength={100}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="phone" style={styles.label}>
                Telefon:
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="555-555-5555"
                style={styles.input}
                required
              />
            </div>
            {!id && (
              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>
                  Şifre:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Şifre girin"
                  style={styles.input}
                  required
                />
              </div>
            )}
            {id && (
              <div style={styles.formGroup}>
                <label htmlFor="role" style={styles.label}>
                  Rol:
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={styles.select}
                  disabled
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            )}
            <button
              type="submit"
              style={styles.submitButton}
              disabled={photoLoading || successMessage}
            >
              {id ? "Güncelle" : "Oluştur"}
            </button>
          </form>
        </div>
      </div>
      {/* Modal */}
      {successMessage && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <p style={styles.modalMessage}>{successMessage}</p>
            <button onClick={handleModalClose} style={styles.modalButton}>
              Tamam
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserForm;
