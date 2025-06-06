import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";
import ErrorComponent from "../ErrorComponent";
import styles from "../../components/css/Users/userDetailStyle";

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
        setError({
          status: err.response?.data?.status,
          message:
              err.response?.data?.message || "User details could not be loaded.",
          errorMessage: err.response?.data?.error || "An Error Occurred",
        });
      }
    };
    const fetchPhoto = async () => {
      setPhotoLoading(true);
      try {
        const response = await api.get(`/customers/${id}/image`, {
          responseType: "blob",
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

  if (error) {
    return (
        <ErrorComponent
            status={error.status}
            message={error.message}
            error={error.errorMessage}
        />
    );
  }

  if (loading) {
    return <p style={styles.loading}>Loading...</p>;
  }

  return (
      <div style={styles.container}>
        <h2 style={styles.title}>User Details</h2>
        <div style={styles.card}>
          <div style={styles.photoContainer}>
            {photoLoading ? (
                <p style={styles.loading}>Photo loading...</p>
            ) : (
                <img
                    src={currentPhotoUrl}
                    alt={user?.username || "Profile"}
                    style={styles.photo}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                />
            )}
          </div>

          <div style={styles.detailGroup}>
            <label style={styles.label}>Username:</label>
            <p style={styles.value}>{user?.username || "Unknown"}</p>
          </div>

          <div style={styles.detailGroup}>
            <label style={styles.label}>Address:</label>
            <p style={styles.value}>{user?.address || "Unknown"}</p>
          </div>

          <div style={styles.detailGroup}>
            <label style={styles.label}>Phone:</label>
            <p style={styles.value}>{user?.phone || "Unknown"}</p>
          </div>

          <div style={styles.detailGroup}>
            <label style={styles.label}>Role:</label>
            <p style={styles.value}>{user?.role || "Unknown"}</p>
          </div>
        </div>
      </div>
  );
};

export default UserDetail;