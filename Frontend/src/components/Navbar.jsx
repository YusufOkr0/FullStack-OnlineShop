import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Kullanıcı bilgileri için AuthContext

const Navbar = () => {
  const { user, logout } = useAuth(); // Kullanıcı bilgilerini ve logout fonksiyonunu alıyoruz
  const location = useLocation();

  // Login ve signup sayfalarında navbar'ı göstermemek için kontrol
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null; // Eğer login veya signup sayfasındaysak navbar'ı render etmiyoruz
  }

  // Fade-in animasyonu için useEffect
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
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
    nav: {
      backgroundColor: "#ffffff",
      padding: isMobile ? "10px 15px" : "15px 30px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      width: "100%",
      boxSizing: "border-box",
      animation: "fadeIn 0.5s ease-in-out",
    },
    container: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: isMobile ? "flex-start" : "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      maxWidth: "1200px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    left: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
    right: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      listStyle: "none",
      margin: isMobile ? "10px 0 0 0" : 0,
      padding: 0,
    },
    li: {
      margin: isMobile ? "10px 0" : "0 15px",
    },
    link: {
      textDecoration: "none",
      fontSize: isMobile ? "14px" : "16px",
      color: "#4a5568",
      fontWeight: "500",
      fontFamily: "'Inter', sans-serif",
      padding: "8px 12px",
      borderRadius: "6px",
      transition: "all 0.3s ease",
    },
    linkHover: {
      color: "#5a67d8",
      backgroundColor: "#f7fafc",
    },
    username: {
      fontSize: isMobile ? "14px" : "16px",
      color: "#1a202c",
      fontWeight: "600",
      fontFamily: "'Inter', sans-serif",
      padding: "8px 12px",
    },
    button: {
      padding: isMobile ? "8px 16px" : "10px 20px",
      backgroundColor: "#5a67d8",
      color: "#ffffff",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontFamily: "'Inter', sans-serif",
    },
    buttonHover: {
      backgroundColor: "#4c51bf",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 8px rgba(90, 103, 216, 0.3)",
    },
    buttonActive: {
      transform: "translateY(0)",
      boxShadow: "none",
    },
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <ul style={styles.left}>
          <li style={styles.li}>
            <Link
              to="/"
              style={styles.link}
              onMouseOver={(e) =>
                Object.assign(e.target.style, styles.linkHover)
              }
              onMouseOut={(e) =>
                Object.assign(e.target.style, {
                  color: styles.link.color,
                  backgroundColor: "transparent",
                })
              }
            >
              Home
            </Link>
          </li>
          <li style={styles.li}>
            <Link
              to="/products"
              style={styles.link}
              onMouseOver={(e) =>
                Object.assign(e.target.style, styles.linkHover)
              }
              onMouseOut={(e) =>
                Object.assign(e.target.style, {
                  color: styles.link.color,
                  backgroundColor: "transparent",
                })
              }
            >
              Products
            </Link>
          </li>
          {user && user.role === "ADMIN" && (
            <>
              <li style={styles.li}>
                <Link
                  to="/users"
                  style={styles.link}
                  onMouseOver={(e) =>
                    Object.assign(e.target.style, styles.linkHover)
                  }
                  onMouseOut={(e) =>
                    Object.assign(e.target.style, {
                      color: styles.link.color,
                      backgroundColor: "transparent",
                    })
                  }
                >
                  Users
                </Link>
              </li>
              <li style={styles.li}>
                <Link
                  to="/orders"
                  style={styles.link}
                  onMouseOver={(e) =>
                    Object.assign(e.target.style, styles.linkHover)
                  }
                  onMouseOut={(e) =>
                    Object.assign(e.target.style, {
                      color: styles.link.color,
                      backgroundColor: "transparent",
                    })
                  }
                >
                  Orders
                </Link>
              </li>
            </>
          )}
          {user && (
            <li style={styles.li}>
              <Link
                to="/myOrders"
                style={styles.link}
                onMouseOver={(e) =>
                  Object.assign(e.target.style, styles.linkHover)
                }
                onMouseOut={(e) =>
                  Object.assign(e.target.style, {
                    color: styles.link.color,
                    backgroundColor: "transparent",
                  })
                }
              >
                My Orders
              </Link>
            </li>
          )}
        </ul>
        <ul style={styles.right}>
          {!user ? (
            <>
              <li style={styles.li}>
                <Link
                  to="/login"
                  style={styles.link}
                  onMouseOver={(e) =>
                    Object.assign(e.target.style, styles.linkHover)
                  }
                  onMouseOut={(e) =>
                    Object.assign(e.target.style, {
                      color: styles.link.color,
                      backgroundColor: "transparent",
                    })
                  }
                >
                  Login
                </Link>
              </li>
              <li style={styles.li}>
                <Link
                  to="/signup"
                  style={styles.link}
                  onMouseOver={(e) =>
                    Object.assign(e.target.style, styles.linkHover)
                  }
                  onMouseOut={(e) =>
                    Object.assign(e.target.style, {
                      color: styles.link.color,
                      backgroundColor: "transparent",
                    })
                  }
                >
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <>
              <li style={styles.li}>
                <span style={styles.username}>
                  <Link
                    style={styles.link}
                    to="/profile"
                    onMouseOver={(e) =>
                      Object.assign(e.target.style, styles.linkHover)
                    }
                    onMouseOut={(e) =>
                      Object.assign(e.target.style, {
                        color: styles.link.color,
                        backgroundColor: "transparent",
                      })
                    }
                  >
                    {user.username}
                  </Link>
                </span>
              </li>
              <li style={styles.li}>
                <button
                  style={styles.button}
                  onClick={logout}
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
                    Object.assign(e.target.style, {
                      transform: "translateY(-1px)",
                    })
                  }
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
