import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // AuthContext üzerinden login işlemi

const Login = () => {
  const [username, setUsername] = useState(""); // Kullanıcı adı
  const [password, setPassword] = useState(""); // Şifre
  const [error, setError] = useState(""); // Hata mesajı
  const { login } = useAuth(); // AuthContext'ten login fonksiyonu
  const navigate = useNavigate(); // Sayfa yönlendirme

  // Prevent scrolling by setting overflow: hidden on body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basit form kontrolü
    if (!username || !password) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      // API'ye login isteği gönderme
      await login(username, password); // Login fonksiyonunu kullanarak giriş yap
      navigate("/"); // Başarılı giriş sonrası anasayfaya yönlendir
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Giriş başarısız. Lütfen tekrar deneyin.";
      setError(errorMessage); // Hata mesajı göster
    }
  };

  // Responsive inline styles
  const isMobile = window.innerWidth <= 768; // Simple mobile detection
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh", // Full viewport height
      width: "100vw", // Full viewport width
      margin: 0,
      padding: isMobile ? "10px" : "20px",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)",
      overflow: "hidden", // Prevent any overflow
      boxSizing: "border-box",
    },
    formContainer: {
      width: isMobile ? "90%" : "100%", // Responsive width
      maxWidth: isMobile ? "none" : "420px", // Limit width on desktop
      padding: isMobile ? "20px" : "40px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      textAlign: "center",
      animation: "fadeIn 0.5s ease-in-out",
      boxSizing: "border-box",
    },
    header: {
      fontSize: isMobile ? "24px" : "32px", // Smaller header on mobile
      color: "#1a202c",
      marginBottom: isMobile ? "20px" : "30px",
      fontWeight: "700",
      fontFamily: "'Inter', sans-serif",
    },
    errorMessage: {
      color: "#f56565",
      fontSize: isMobile ? "12px" : "14px",
      marginBottom: isMobile ? "15px" : "20px",
      fontWeight: "500",
      backgroundColor: "#fff5f5",
      padding: "10px",
      borderRadius: "6px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    inputGroup: {
      marginBottom: isMobile ? "16px" : "24px",
      textAlign: "left",
    },
    label: {
      fontSize: isMobile ? "13px" : "15px",
      color: "#4a5568",
      marginBottom: "10px",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
    },
    input: {
      padding: isMobile ? "12px 14px" : "14px 16px",
      fontSize: isMobile ? "14px" : "16px",
      color: "#2d3748",
      backgroundColor: "#f7fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      width: "100%",
      transition: "all 0.3s ease",
      fontFamily: "'Inter', sans-serif",
      boxSizing: "border-box",
    },
    inputFocus: {
      outline: "none",
      borderColor: "#5a67d8",
      boxShadow: "0 0 0 3px rgba(90, 103, 216, 0.2)",
      backgroundColor: "#ffffff",
    },
    button: {
      padding: isMobile ? "12px" : "16px",
      backgroundColor: "#5a67d8",
      color: "#ffffff",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontFamily: "'Inter', sans-serif",
      marginTop: isMobile ? "5px" : "10px",
    },
    buttonHover: {
      backgroundColor: "#4c51bf",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
    },
    buttonActive: {
      transform: "translateY(0)",
      boxShadow: "none",
    },
    secondaryButton: {
      padding: isMobile ? "12px" : "16px",
      backgroundColor: "transparent",
      color: "#5a67d8",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      border: "1px solid #5a67d8",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontFamily: "'Inter', sans-serif",
      marginTop: isMobile ? "10px" : "15px",
    },
    secondaryButtonHover: {
      backgroundColor: "#5a67d8",
      color: "#ffffff",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
    },
    secondaryButtonActive: {
      transform: "translateY(0)",
      boxShadow: "none",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Giriş Yap</h2>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>
              Kullanıcı Adı
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) =>
                Object.assign(e.target.style, {
                  borderColor: "#e2e8f0",
                  boxShadow: "none",
                  backgroundColor: "#f7fafc",
                })
              }
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) =>
                Object.assign(e.target.style, {
                  borderColor: "#e2e8f0",
                  boxShadow: "none",
                  backgroundColor: "#f7fafc",
                })
              }
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) =>
              Object.assign(e.target.style, styles.buttonHover)
            }
            onMouseOut={(e) =>
              Object.assign(e.target.style, {
                backgroundColor: styles.button.backgroundColor,
                transform: "none",
                boxShadow: "none",
              })
            }
            onMouseDown={(e) =>
              Object.assign(e.target.style, styles.buttonActive)
            }
            onMouseUp={(e) =>
              Object.assign(e.target.style, { transform: "translateY(-2px)" })
            }
          >
            Giriş Yap
          </button>
        </form>
        <button
          style={styles.secondaryButton}
          onClick={() => navigate("/signup")}
          onMouseOver={(e) =>
            Object.assign(e.target.style, styles.secondaryButtonHover)
          }
          onMouseOut={(e) =>
            Object.assign(e.target.style, {
              backgroundColor: styles.secondaryButton.backgroundColor,
              color: styles.secondaryButton.color,
              transform: "none",
              boxShadow: "none",
            })
          }
          onMouseDown={(e) =>
            Object.assign(e.target.style, styles.secondaryButtonActive)
          }
          onMouseUp={(e) =>
            Object.assign(e.target.style, { transform: "translateY(-2px)" })
          }
        >
          Kayıt Ol
        </button>
      </div>
    </div>
  );
};

// Inline CSS animation for fade-in effect
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

export default Login;
