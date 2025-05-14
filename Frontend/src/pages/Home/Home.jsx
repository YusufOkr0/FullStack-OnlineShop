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
