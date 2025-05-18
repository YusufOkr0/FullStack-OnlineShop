import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // AuthContext üzerinden kullanıcı bilgisi alıyoruz
import styles from "../../components/css/Home/HomeStyle";

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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerH1}>
          Welcome {user ? user.username : "Visitor"}!
        </h1>
        <p style={styles.headerP}>
          {user
            ? "Welcome, you can start your transactions."
            : "Please log in or sign up."}
        </p>
      </div>

      <div style={styles.content}>
        <h2 style={styles.contentH2}>Featured Content</h2>
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
            <h3 style={styles.cardH3}>Products</h3>
            <p style={styles.cardP}>Discover the latest products added.</p>
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
              Go to Products
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
                <h3 style={styles.cardH3}>Orders</h3>
                <p style={styles.cardP}>View orders</p>
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
                  Go Orders
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
                  <h3 style={styles.cardH3}>Management</h3>
                  <p style={styles.cardP}>Manage products and users.</p>
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
                    Users
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
