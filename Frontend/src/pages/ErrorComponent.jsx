import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ErrorComponent = ({ status, message }) => {
  const navigate = useNavigate();

  // Responsive inline styles (ProductForm ile uyumlu)
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
    },
    errorCard: {
      maxWidth: "600px",
      width: "100%",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      padding: isMobile ? "20px" : "30px",
      textAlign: "center",
      animation: "fadeIn 0.5s ease-in-out",
    },
    title: {
      fontSize: isMobile ? "24px" : "30px",
      color: "#1a202c",
      fontWeight: "700",
      fontFamily: "'Inter', sans-serif",
      marginBottom: "15px",
    },
    status: {
      fontSize: isMobile ? "16px" : "18px",
      color: "#f56565",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      marginBottom: "10px",
    },
    message: {
      fontSize: isMobile ? "14px" : "16px",
      color: "#4a5568",
      fontFamily: "'Inter', sans-serif",
      marginBottom: "20px",
      wordBreak: "break-word",
    },
    button: {
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
      margin: "0 10px",
    },
  };

  // Hover ve focus efektleri
  styles.button[":hover"] = {
    backgroundColor: "#4c51bf",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
  };
  styles.button[":active"] = {
    transform: "translateY(0)",
    boxShadow: "none",
  };

  // FadeIn animasyonu
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

  return (
    <div style={styles.container}>
      <div style={styles.errorCard}>
        <h2 style={styles.title}>Bir Hata Oluştu</h2>
        {status && <p style={styles.status}>Hata Kodu: {status}</p>}
        <p style={styles.message}>{message || "Bilinmeyen bir hata oluştu."}</p>
        <button style={styles.button} onClick={() => navigate("/products")}>
          Geri Dön
        </button>
      </div>
    </div>
  );
};

export default ErrorComponent;
