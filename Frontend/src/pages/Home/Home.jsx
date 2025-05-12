import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // AuthContext üzerinden kullanıcı bilgisi alıyoruz

const Home = () => {
  const { user } = useAuth(); // Giriş yapan kullanıcıyı alıyoruz
  console.log("User:", user); // Debugging için

  // Fade-in animasyonu için useEffect
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

  // Responsive inline styles
  const isMobile = window.innerWidth <= 768; // Simple mobile detection
  const styles = {
    container: {
      minHeight: "100vh", // Full viewport height
      width: "100%",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)", // Same gradient as Login/Signup
      padding: isMobile ? "20px" : "40px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    header: {
      textAlign: "center",
      marginBottom: isMobile ? "30px" : "50px",
      animation: "fadeIn 0.5s ease-in-out",
    },
    headerH1: {
      fontSize: isMobile ? "28px" : "36px",
      color: "#1a202c",
      fontWeight: "700",
      fontFamily: "'Inter', sans-serif",
      marginBottom: "15px",
    },
    headerP: {
      fontSize: isMobile ? "16px" : "18px",
      color: "#4a5568",
      fontWeight: "400",
      fontFamily: "'Inter', sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
    },
    content: {
      width: "100%",
      maxWidth: "1200px",
      textAlign: "center",
    },
    contentH2: {
      fontSize: isMobile ? "24px" : "32px",
      color: "#1a202c",
      fontWeight: "700",
      fontFamily: "'Inter', sans-serif",
      marginBottom: isMobile ? "20px" : "30px",
    },
    cards: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "20px" : "30px",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)", // Same shadow as Login/Signup
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
    cardH3: {
      fontSize: isMobile ? "20px" : "24px",
      color: "#1a202c",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      marginBottom: "15px",
    },
    cardP: {
      fontSize: isMobile ? "14px" : "16px",
      color: "#4a5568",
      fontWeight: "400",
      fontFamily: "'Inter', sans-serif",
      marginBottom: "20px",
    },
    cardLink: {
      display: "inline-block",
      padding: isMobile ? "10px 20px" : "12px 24px",
      backgroundColor: "#5a67d8", // Same indigo as buttons
      color: "#ffffff",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      textDecoration: "none",
      borderRadius: "8px",
      transition: "all 0.3s ease",
    },
    cardLinkHover: {
      backgroundColor: "#4c51bf",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
    },
    cardLinkActive: {
      transform: "translateY(0)",
      boxShadow: "none",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerH1}>
          Hoşgeldiniz {user ? user.username : "Ziyaretçi"}!
        </h1>
        <p style={styles.headerP}>
          {user
            ? "Hoş geldiniz, işlemlerinize başlayabilirsiniz."
            : "Lütfen giriş yapın veya kaydolun."}
        </p>
      </div>

      <div style={styles.content}>
        <h2 style={styles.contentH2}>Öne Çıkan İçerikler</h2>
        <div style={styles.cards}>
          <div
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
            <h3 style={styles.cardH3}>Ürünler</h3>
            <p style={styles.cardP}>En son eklenen ürünleri keşfedin.</p>
            <Link
              to="/products"
              style={styles.cardLink}
              onMouseOver={(e) =>
                Object.assign(e.target.style, styles.cardLinkHover)
              }
              onMouseOut={(e) =>
                Object.assign(e.target.style, {
                  backgroundColor: styles.cardLink.backgroundColor,
                  transform: "none",
                  boxShadow: "none",
                })
              }
              onMouseDown={(e) =>
                Object.assign(e.target.style, styles.cardLinkActive)
              }
              onMouseUp={(e) =>
                Object.assign(e.target.style, { transform: "translateY(-2px)" })
              }
            >
              Ürünlere Git
            </Link>
          </div>
          {user && (
            <>
              <div
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
                <h3 style={styles.cardH3}>Siparişler</h3>
                <p style={styles.cardP}>Geçmiş siparişlerinizi görüntüleyin.</p>
                <Link
                  to={user.role === "ADMIN" ? "/orders" : "/myorders"}
                  style={styles.cardLink}
                  onMouseOver={(e) =>
                    Object.assign(e.target.style, styles.cardLinkHover)
                  }
                  onMouseOut={(e) =>
                    Object.assign(e.target.style, {
                      backgroundColor: styles.cardLink.backgroundColor,
                      transform: "none",
                      boxShadow: "none",
                    })
                  }
                  onMouseDown={(e) =>
                    Object.assign(e.target.style, styles.cardLinkActive)
                  }
                  onMouseUp={(e) =>
                    Object.assign(e.target.style, {
                      transform: "translateY(-2px)",
                    })
                  }
                >
                  Siparişlere Git
                </Link>
              </div>
              {user.role === "ADMIN" && (
                <div
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
                  <h3 style={styles.cardH3}>Yönetim</h3>
                  <p style={styles.cardP}>Ürünleri ve kullanıcıları yönetin.</p>
                  <Link
                    to="/users"
                    style={styles.cardLink}
                    onMouseOver={(e) =>
                      Object.assign(e.target.style, styles.cardLinkHover)
                    }
                    onMouseOut={(e) =>
                      Object.assign(e.target.style, {
                        backgroundColor: styles.cardLink.backgroundColor,
                        transform: "none",
                        boxShadow: "none",
                      })
                    }
                    onMouseDown={(e) =>
                      Object.assign(e.target.style, styles.cardLinkActive)
                    }
                    onMouseUp={(e) =>
                      Object.assign(e.target.style, {
                        transform: "translateY(-2px)",
                      })
                    }
                  >
                    Kullanıcılar
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
