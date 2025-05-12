import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const API_BASE_URL = "http://localhost:8080";

const MyProfile = () => {
  const { user, fetchUser, logout } = useAuth();
  const [profile, setProfile] = useState({
    id: "",
    username: "",
    address: "",
    phone: "",
    role: "",
  });
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(
    "https://via.placeholder.com/150"
  );
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);

  // Kullanıcı verilerini ve fotoğrafı çekme
  useEffect(() => {
    if (user) {
      setProfile({
        id: user.id || "",
        username: user.username || "",
        address: user.address || "",
        phone: user.phone || "",
        role: user.role || "",
      });

      // Fotoğrafı API'den çek
      const fetchPhoto = async () => {
        if (!user.id) return;
        setPhotoLoading(true);
        try {
          const response = await api.get(`/customers/${user.id}/image`, {
            responseType: "blob", // Resmi blob olarak al
          });
          const imageUrl = URL.createObjectURL(response.data);
          setCurrentPhotoUrl(imageUrl);
          if (!newPhotoFile) {
            setPreviewPhotoUrl(imageUrl);
          }
        } catch (err) {
          console.error("Photo fetch error:", err);
          setCurrentPhotoUrl("https://via.placeholder.com/150");
          if (!newPhotoFile) {
            setPreviewPhotoUrl("https://via.placeholder.com/150");
          }
        } finally {
          setPhotoLoading(false);
        }
      };

      fetchPhoto();
    }
  }, [user, newPhotoFile]);

  // FadeIn animasyonu ekleme
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhotoFile(file);
      setPreviewPhotoUrl(URL.createObjectURL(file));
      setError("");
    } else {
      setNewPhotoFile(null);
      setPreviewPhotoUrl("");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!profile.id) {
      setError("Kullanıcı ID bulunamadı. Güncelleme yapılamıyor.");
      return;
    }

    // Orijinal kullanıcı adını kaydet
    const originalUsername = user.username;

    const formData = new FormData();
    const updateCustomerRequest = {
      username: profile.username,
      address: profile.address,
      phone: profile.phone,
    };

    formData.append(
      "updateCustomerRequest",
      new Blob([JSON.stringify(updateCustomerRequest)], {
        type: "application/json",
      })
    );

    if (newPhotoFile) {
      formData.append("file", newPhotoFile);
    }

    try {
      const response = await api.put(
        `/customers/updateById/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage(response.data);
      alert("Profil başarıyla güncellendi!");

      setNewPhotoFile(null);
      setPreviewPhotoUrl("");

      // Kullanıcı adı değiştiyse logout yap
      if (profile.username !== originalUsername) {
        alert("Kullanıcı adı değiştiği için oturumunuz kapatılacak.");
        logout();
        return; // Logout sonrası diğer işlemleri atla
      }

      if (fetchUser) {
        await fetchUser();
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        "Profil güncellenemedi.";
      setError(errorMessage);
      console.error("Update Error:", err.response || err);
    }
  };

  // Responsive inline styles (ProductList'ten uyarlandı)
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
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      padding: isMobile ? "20px" : "30px",
      width: isMobile ? "100%" : "600px",
      textAlign: "center",
      transition: "all 0.3s ease",
      animation: "fadeIn 0.5s ease-in-out",
    },
    title: {
      fontSize: isMobile ? "28px" : "36px",
      color: "#1a202c",
      fontWeight: "700",
      fontFamily: "'Inter', sans-serif",
      marginBottom: isMobile ? "20px" : "30px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    photoContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "20px",
    },
    photo: {
      width: isMobile ? "120px" : "150px",
      height: isMobile ? "120px" : "150px",
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: "10px",
      border: "2px solid #dee2e6",
      backgroundColor: "#f8f9fa",
    },
    photoInput: {
      display: "none",
    },
    photoButton: {
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
    formGroup: {
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
    updateButton: {
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
    },
    error: {
      textAlign: "center",
      fontSize: isMobile ? "14px" : "16px",
      color: "#f56565",
      marginBottom: "15px",
      animation: "fadeIn 0.5s ease-in-out",
    },
    success: {
      textAlign: "center",
      fontSize: isMobile ? "14px" : "16px",
      color: "#28a745",
      marginBottom: "15px",
      animation: "fadeIn 0.5s ease-in-out",
    },
    loading: {
      textAlign: "center",
      fontSize: isMobile ? "16px" : "18px",
      color: "#4a5568",
      marginTop: "50px",
      animation: "fadeIn 0.5s ease-in-out",
    },
  };

  // Hover ve active efektleri
  styles.photoButton[":hover"] = {
    backgroundColor: "#4c51bf",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
  };
  styles.photoButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };
  styles.updateButton[":hover"] = {
    backgroundColor: "#4c51bf",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
  };
  styles.updateButton[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };
  styles.input[":focus"] = {
    borderColor: "#5a67d8",
    boxShadow: "0 0 0 3px rgba(90, 103, 216, 0.1)",
  };

  if (!user) {
    return <div style={styles.loading}>Profil yükleniyor...</div>;
  }

  const displayImageUrl =
    newPhotoFile && previewPhotoUrl ? previewPhotoUrl : currentPhotoUrl;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Profilim</h2>
      <div style={styles.card}>
        {photoLoading && <p style={styles.loading}>Fotoğraf yükleniyor...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}
        <form onSubmit={handleUpdate} style={styles.form}>
          <div style={styles.photoContainer}>
            <img
              src={displayImageUrl}
              alt="Profil"
              style={styles.photo}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={styles.photoInput}
              id="photo-upload"
            />
            <label htmlFor="photo-upload" style={styles.photoButton}>
              Fotoğraf Yükle
            </label>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>
              Kullanıcı Adı:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              style={styles.input}
              required
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
              value={profile.address}
              onChange={handleInputChange}
              style={styles.input}
              required
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
              value={profile.phone}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="role" style={styles.label}>
              Rol:
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={profile.role}
              style={styles.input}
              disabled
            />
          </div>

          <button type="submit" style={styles.updateButton}>
            Profili Güncelle
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
