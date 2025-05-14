import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import ErrorComponent from "../ErrorComponent";
import styles from "../../components/css/Users/userFormStyle";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    address: "",
    phone: "",
    password: "",
    ...(id ? { role: "CUSTOMER" } : {}),
  });
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(
    "https://via.placeholder.com/150"
  );
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        console.log("Navigating to /users from modal timeout");
        navigate("/users", { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/customers/${id}`);
          const { username, address, phone, role } = response.data;
          console.log("User data:", response.data);
          setFormData({
            username: username || "",
            address: address || "",
            phone: phone || "",
            role: role || "CUSTOMER",
            password: "",
          });
        } catch (err) {
          setError({
            status: err.response?.status || null,
            message:
              err.response?.data?.message || "Kullanıcı verileri yüklenemedi.",
            errorMessage: err.response?.data?.error || "Bir Hata Oluştu",
          });
          console.error("Fetch user error:", err);
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
          setCurrentPhotoUrl("https://via.placeholder.com/150");
        } finally {
          setPhotoLoading(false);
        }
      };

      const loadData = async () => {
        await Promise.all([fetchUser(), fetchPhoto()]);
      };

      loadData();

      return () => {
        if (
          currentPhotoUrl &&
          currentPhotoUrl !== "https://via.placeholder.com/150"
        ) {
          URL.revokeObjectURL(currentPhotoUrl);
        }
      };
    }
  }, [id]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes modalFadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, phone: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted, preventing default behavior");
    setError(null);
    setSuccessMessage(null);

    if (
      !formData.username ||
      !formData.address ||
      !formData.phone ||
      (!id && !formData.password)
    ) {
      setError({
        status: null,
        message: "Lütfen tüm alanları doldurun.",
      });
      return;
    }

    if (formData.username.length > 16) {
      setError({
        status: null,
        message: "Kullanıcı adı 16 karakterden kısa olmalıdır.",
      });
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setError({
        status: null,
        message: "Telefon numarası 10 rakam olmalı (555-555-5555 formatında).",
      });
      return;
    }

    if (formData.address.length < 5) {
      setError({
        status: null,
        message: "Adres en az 5 karakter olmalı.",
      });
      return;
    }

    if (formData.address.length > 100) {
      setError({
        status: null,
        message: "Adres 100 karakterden kısa olmalıdır.",
      });
      return;
    }

    try {
      if (id) {
        const updateData = new FormData();
        const updateCustomerRequest = {
          username: formData.username,
          address: formData.address,
          phone: formData.phone,
        };
        updateData.append(
          "updateCustomerRequest",
          new Blob([JSON.stringify(updateCustomerRequest)], {
            type: "application/json",
          })
        );

        await api.put(`/customers/updateById/${id}`, updateData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage("Kullanıcı başarıyla güncellendi!");
      } else {
        await api.post("/admin/add", {
          username: formData.username,
          phone: formData.phone,
          address: formData.address,
          password: formData.password,
        });
        setSuccessMessage("Kullanıcı başarıyla oluşturuldu!");
      }
    } catch (err) {
      setError({
        status: err.response?.status || null,
        message:
          err.response?.data?.message || "Kullanıcı kaydedilirken hata oluştu.",
        errorMessage: err.response?.data?.error || "Bir Hata Oluştu",
      });
      console.error("Submit error:", err);
    }
  };

  const handleModalClose = () => {
    setSuccessMessage(null);
    console.log("Navigating to /users from modal close");
    navigate("/users", { replace: true });
  };

  if (photoLoading) {
    return <p style={styles.loading}>Yükleniyor...</p>;
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

  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.title}>
          {id ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Oluştur"}
        </h2>
        <div style={styles.form}>
          <form onSubmit={handleSubmit}>
            {id && (
              <div style={styles.photoContainer}>
                <img
                  src={currentPhotoUrl}
                  alt="Profil"
                  style={styles.photo}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>
            )}
            <div style={styles.formGroup}>
              <label htmlFor="username" style={styles.label}>
                Kullanıcı Adı:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Kullanıcı adı girin"
                style={styles.input}
                required
                maxLength={16}
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
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Adres girin"
                style={styles.input}
                required
                maxLength={100}
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
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="555-555-5555"
                style={styles.input}
                required
              />
            </div>
            {!id && (
              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>
                  Şifre:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Şifre girin"
                  style={styles.input}
                  required
                />
              </div>
            )}
            {id && (
              <div style={styles.formGroup}>
                <label htmlFor="role" style={styles.label}>
                  Rol:
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={styles.select}
                  disabled
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            )}
            <button
              type="submit"
              style={styles.submitButton}
              disabled={successMessage}
            >
              {id ? "Güncelle" : "Oluştur"}
            </button>
          </form>
        </div>
      </div>
      {successMessage && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <p style={styles.modalMessage}>{successMessage}</p>
            <button onClick={handleModalClose} style={styles.modalButton}>
              Tamam
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserForm;
