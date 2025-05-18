import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "../../components/css/Login/Login.js";

const Login = () => {
  const [username, setUsername] = useState(""); // Kullanıcı adı
  const [password, setPassword] = useState(""); // Şifre
  const [error, setError] = useState(""); // Hata mesajı
  const { login } = useAuth(); // AuthContext'ten login fonksiyonu
  const navigate = useNavigate(); // Sayfa yönlendirme


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
      setError("Please fill in all fields.");
      return;
    }

    try {
      // API'ye login isteği gönderme
      await login(username, password); // Login fonksiyonunu kullanarak giriş yap
      navigate("/"); // Başarılı giriş sonrası anasayfaya yönlendir
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please try again.";
      setError(errorMessage); // Hata mesajı göster
    }
  };

  // Responsive inline styles


  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Sign in</h2>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
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
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Please enter your password"
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
            Sign in
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
          Sign up
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
