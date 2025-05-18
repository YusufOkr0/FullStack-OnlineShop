import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../components/css/Signup/Signup.js";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8090';

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
      setError("Please fill in all fields.");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setError("Phone number must be 10 digits (format: 555-555-5555).");
      return;
    }

    if (address.length < 5) {
      setError("Address must be at least 5 characters long.");
      return;
    }

    try {
      await axios.post(API_BASE_URL + "/auth/register", {
        username,
        phone,
        password,
        address,
      });
      navigate("/login");
    } catch (err) {
      setError(
          err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2 style={styles.header}>Sign Up</h2>
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
              <label htmlFor="phone" style={styles.label}>
                Phone
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
                Password
              </label>
              <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
                Address
              </label>
              <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
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
              Sign Up
            </button>
          </form>
          <button
              style={styles.secondaryButton}
              onClick={() => navigate("/login")}
              onMouseOver={(e) =>
                  Object.assign(ionic(e.target.style, styles.secondaryButtonHover))
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
            Log In
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