import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import ErrorComponent from "../ErrorComponent";
import styles from "../../components/css/Profile/MyProfileStyle";

const MyProfile = () => {
  const { user, fetchUser, logout } = useAuth();
  const [profile, setProfile] = useState({
    id: "",
    username: "",
    address: "",
    phone: "",
    role: "",
  });
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(
    "https://via.placeholder.com/150"
  );
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        id: user.id || "",
        username: user.username || "",
        address: user.address || "",
        phone: user.phone || "",
        role: user.role || "",
      });

      const fetchPhoto = async () => {
        if (!user.id) return;
        setPhotoLoading(true);
        try {
          const response = await api.get(`/customers/${user.id}/image`, {
            responseType: "blob",
          });
          const imageUrl = URL.createObjectURL(response.data);
          setCurrentPhotoUrl(imageUrl);
          if (!newPhotoFile) {
            setPreviewPhotoUrl(imageUrl);
          }
        } catch (err) {
          setCurrentPhotoUrl("https://via.placeholder.com/150");
          if (!newPhotoFile) {
            setPreviewPhotoUrl("https://via.placeholder.com/150");
          }
        } finally {
          setPhotoLoading(false);
        }
      };

      fetchPhoto();
    }

    return () => {
      if (
        currentPhotoUrl &&
        currentPhotoUrl !== "https://via.placeholder.com/150"
      ) {
        URL.revokeObjectURL(currentPhotoUrl);
      }
      if (
        previewPhotoUrl &&
        previewPhotoUrl !== "https://via.placeholder.com/150"
      ) {
        URL.revokeObjectURL(previewPhotoUrl);
      }
    };
  }, [user, newPhotoFile]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhotoFile(file);
      setPreviewPhotoUrl(URL.createObjectURL(file));
      setError(null);
    } else {
      setNewPhotoFile(null);
      setPreviewPhotoUrl("");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    if (!profile.id) {
      setError({
        status: null,
        message: "Kullanıcı ID bulunamadı. Güncelleme yapılamıyor.",
      });
      return;
    }

    const originalUsername = user.username;
    const formData = new FormData();
    const updateCustomerRequest = {
      username: profile.username,
      address: profile.address,
      phone: profile.phone,
    };

    formData.append(
      "updateCustomerRequest",
      new Blob([JSON.stringify(updateCustomerRequest)], {
        type: "application/json",
      })
    );

    if (newPhotoFile) {
      formData.append("file", newPhotoFile);
    }

    try {
      const response = await api.put(
        `/customers/updateById/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage(
        response.data?.message || "Profil başarıyla güncellendi!"
      );
      setTimeout(() => setSuccessMessage(""), 3000);

      setNewPhotoFile(null);
      setPreviewPhotoUrl("");

      if (profile.username !== originalUsername) {
        alert("Kullanıcı adı değiştiği için oturumunuz kapatılacak.");
        logout();
        return;
      }

      if (fetchUser) {
        await fetchUser();
      }
    } catch (err) {
      setError({
        status: err.response?.status || null,
        message: err.response?.data?.message || "Profil güncellenemedi.",
        errorMessage: err.response?.data?.error || "Bir Hata Oluştu",
      });
      console.error("Update error:", err);
    }
  };

  if (!user) {
    return <div style={styles.loading}>Profil yükleniyor...</div>;
  }

  if (error) {
    return (
      <ErrorComponent
        status={error.status}
        message={error.message}
        error={error.errorMessage}
      />
    );
  }

  const displayImageUrl =
    newPhotoFile && previewPhotoUrl ? previewPhotoUrl : currentPhotoUrl;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Profilim</h2>
      <div style={styles.card}>
        {photoLoading && <p style={styles.loading}>Fotoğraf yükleniyor...</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}
        <form onSubmit={handleUpdate} style={styles.form}>
          <div style={styles.photoContainer}>
            <img
              src={displayImageUrl}
              alt="Profil"
              style={styles.photo}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={styles.photoInput}
              id="photo-upload"
            />
            <label htmlFor="photo-upload" style={styles.photoButton}>
              Fotoğraf Yükle
            </label>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>
              Kullanıcı Adı:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="address" style={styles.label}>
              Adres:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="phone" style={styles.label}>
              Telefon:
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="role" style={styles.label}>
              Rol:
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={profile.role}
              style={styles.input}
              disabled
            />
          </div>

          <button type="submit" style={styles.updateButton}>
            Profili Güncelle
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
