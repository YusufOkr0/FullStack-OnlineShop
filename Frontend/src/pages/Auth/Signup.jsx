import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Format phone number to 555-555-5555
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

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!username || !phone || !password || !address) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setError("Telefon numarası 10 rakam olmalı (555-555-5555 formatında).");
      return;
    }

    if (address.length < 5) {
      setError("Adres en az 5 karakter olmalı.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/auth/register", {
        username,
        phone,
        password,
        address,
      });
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Kaydolma başarısız. Lütfen tekrar deneyin."
      );
    }
  };

  // Responsive inline styles
  const isMobile = window.innerWidth <= 768;
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      margin: 0,
      padding: isMobile ? "10px" : "20px",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)",
      overflow: "hidden",
      boxSizing: "border-box",
    },
    formContainer: {
      width: isMobile ? "90%" : "100%",
      maxWidth: isMobile ? "none" : "400px",
      padding: isMobile ? "15px" : "30px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      textAlign: "center",
      animation: "fadeIn 0.5s ease-in-out",
      boxSizing: "border-box",
    },
    header: {
      fontSize: isMobile ? "22px" : "28px",
      color: "#1a202c",
      marginBottom: isMobile ? "15px" : "20px",
      fontWeight: "700",
      fontFamily: "'Inter', sans-serif",
    },
    errorMessage: {
      color: "#f56565",
      fontSize: isMobile ? "12px" : "13px",
      marginBottom: isMobile ? "10px" : "15px",
      fontWeight: "500",
      backgroundColor: "#fff5f5",
      padding: "8px",
      borderRadius: "6px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    inputGroup: {
      marginBottom: isMobile ? "12px" : "16px",
      textAlign: "left",
    },
    label: {
      fontSize: isMobile ? "12px" : "14px",
      color: "#4a5568",
      marginBottom: "8px",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
    },
    input: {
      padding: isMobile ? "10px 12px" : "12px 14px",
      fontSize: isMobile ? "13px" : "15px",
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
      padding: isMobile ? "10px" : "14px",
      backgroundColor: "#5a67d8",
      color: "#ffffff",
      fontSize: isMobile ? "13px" : "15px",
      fontWeight: "600",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontFamily: "'Inter', sans-serif",
      marginTop: isMobile ? "5px" : "8px",
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
      padding: isMobile ? "10px" : "14px",
      backgroundColor: "transparent",
      color: "#5a67d8",
      fontSize: isMobile ? "13px" : "15px",
      fontWeight: "600",
      border: "1px solid #5a67d8",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontFamily: "'Inter', sans-serif",
      marginTop: isMobile ? "8px" : "12px",
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
        <h2 style={styles.header}>Kayıt Ol</h2>
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
            <label htmlFor="phone" style={styles.label}>
              Telefon
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="555-555-5555"
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
          <div style={styles.inputGroup}>
            <label htmlFor="address" style={styles.label}>
              Adres
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Adresinizi girin"
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
            Kayıt Ol
          </button>
        </form>
        <button
          style={styles.secondaryButton}
          onClick={() => navigate("/login")}
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
          Giriş Yap
        </button>
      </div>
    </div>
  );
};

// Inline CSS animation
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

export default Signup;
