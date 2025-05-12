import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(
    "https://via.placeholder.com/150"
  );
  const [loading, setLoading] = useState(true);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/customers/${id}`);
        console.log("User data:", response.data);
        setUser(response.data);
      } catch (err) {
        setError("Kullanıcı detayları yüklenemedi.");
        console.error(err);
      }
    };

    const fetchPhoto = async () => {
      setPhotoLoading(true);
      try {
        const response = await api.get(`/customers/${id}/image`, {
          responseType: "blob", // Resmi blob olarak al
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
      setLoading(false);
    };

    loadData();
  }, [id]);

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

  // Responsive inline styles (ProductList'ten uyarlandı)
  const isMobile = window.innerWidth <= 768;
  const styles = {
    container: {
      minHeight: "calc(100vh - 60px)", // Navbar için 60px
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
      overflow: "hidden",
    },
    title: {
      fontSize: isMobile ? "28px" : "36px",
      fontWeight: "700",
      color: "#1a202c",
      marginBottom: isMobile ? "20px" : "30px",
      textAlign: "center",
      animation: "fadeIn 0.5s ease-in-out",
    },
    card: {
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
      justifyContent: "center",
      marginBottom: isMobile ? "15px" : "20px",
    },
    photo: {
      width: isMobile ? "120px" : "150px",
      height: isMobile ? "120px" : "150px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #dee2e6",
      backgroundColor: "#f8f9fa",
      transition: "transform 0.3s ease",
    },
    detailGroup: {
      marginBottom: isMobile ? "15px" : "20px",
    },
    label: {
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      color: "#1a202c",
      marginBottom: "8px",
      display: "block",
    },
    value: {
      fontSize: isMobile ? "14px" : "16px",
      color: "#4a5568",
      backgroundColor: "#f8f9fa",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #dee2e6",
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
  };

  // Hover efekti
  styles.photo[":hover"] = {
    transform: "scale(1.05)",
  };

  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Kullanıcı Detayları</h2>
      <div style={styles.card}>
        {/* Fotoğraf Bölümü */}
        <div style={styles.photoContainer}>
          {photoLoading ? (
            <p style={styles.loading}>Fotoğraf yükleniyor...</p>
          ) : (
            <img
              src={currentPhotoUrl}
              alt={user?.username || "Profil"}
              style={styles.photo}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
          )}
        </div>

        {/* Kullanıcı Detayları */}
        <div style={styles.detailGroup}>
          <label style={styles.label}>Kullanıcı Adı:</label>
          <p style={styles.value}>{user?.username || "Bilinmiyor"}</p>
        </div>

        <div style={styles.detailGroup}>
          <label style={styles.label}>Adres:</label>
          <p style={styles.value}>{user?.address || "Bilinmiyor"}</p>
        </div>

        <div style={styles.detailGroup}>
          <label style={styles.label}>Telefon:</label>
          <p style={styles.value}>{user?.phone || "Bilinmiyor"}</p>
        </div>

        <div style={styles.detailGroup}>
          <label style={styles.label}>Rol:</label>
          <p style={styles.value}>{user?.role || "Bilinmiyor"}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
