import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import ErrorComponent from "../ErrorComponent";
import styles from "../../components/css/Users/userFormStyle";


import defaultUserPhoto from '../../assets/noImage.jpg';

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

    // 2. Başlangıç state'ini içe aktarılan görsel ile değiştirin
    const [currentPhotoUrl, setCurrentPhotoUrl] = useState(defaultUserPhoto);

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
                            err.response?.data?.message || "Could not load user data.", // Translated
                        errorMessage: err.response?.data?.error || "An Error Occurred", // Translated
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
                    // API'dan gelen Blob'dan URL oluştur
                    const imageUrl = URL.createObjectURL(response.data);
                    setCurrentPhotoUrl(imageUrl);
                } catch (err) {
                    // API'dan fotoğraf alınamazsa, yerel varsayılanı kullan
                    console.error("Fetch photo error:", err);
                    // 3. Hata durumunda yerel varsayılan görseli kullanın
                    setCurrentPhotoUrl(defaultUserPhoto);
                } finally {
                    setPhotoLoading(false);
                }
            };

            const loadData = async () => {
                // Promise.all ile iki fetch işlemini paralel çalıştır
                await Promise.all([fetchUser(), fetchPhoto()]);
            };

            loadData();

            // Cleanup function to revoke the temporary object URL created for the photo blob
            return () => {
                // Sadece URL.createObjectURL ile oluşturulmuş 'blob:' URL'lerini iptal et
                // Yerel varsayılan görsel URL'sini iptal etmeye gerek YOKTUR.
                if (currentPhotoUrl && currentPhotoUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(currentPhotoUrl);
                }
            };
        }
    }, [id]); // Efekt sadece 'id' değiştiğinde çalışır

    // ... (diğer useEffect ve fonksiyonlar aynı kalır)

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
                message: "Please fill in all fields.", // Translated
            });
            return;
        }

        if (formData.username.length > 16) {
            setError({
                status: null,
                message: "Username must be shorter than 16 characters.", // Translated
            });
            return;
        }

        const phoneDigits = formData.phone.replace(/\D/g, "");
        if (phoneDigits.length !== 10) {
            setError({
                status: null,
                message: "Phone number must be 10 digits (in 555-555-5555 format).", // Translated
            });
            return;
        }

        if (formData.address.length < 5) {
            setError({
                status: null,
                message: "Address must be at least 5 characters long.", // Translated
            });
            return;
        }

        if (formData.address.length > 100) {
            setError({
                status: null,
                message: "Address must be shorter than 100 characters.", // Translated
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

                // Eğer fotoğraf güncelleme bu formdan yapılacaksa, buraya eklemeniz gerekir
                // Örneğin: updateData.append('photoFile', selectedFile);

                await api.put(`/customers/updateById/${id}`, updateData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                setSuccessMessage("User updated successfully!"); // Translated
            } else {
                // Yeni kullanıcı oluşturma
                await api.post("/admin/add", {
                    username: formData.username,
                    phone: formData.phone,
                    address: formData.address,
                    password: formData.password,
                    // Rol varsayılan olarak "CUSTOMER" veya initial state'de belirlenmiş neyse o
                    role: formData.role
                });
                setSuccessMessage("User created successfully!"); // Translated
            }
        } catch (err) {
            setError({
                status: err.response?.status || null,
                message:
                    err.response?.data?.message || "An error occurred while saving the user.", // Translated
                errorMessage: err.response?.data?.error || "An Error Occurred", // Translated
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
        return <p style={styles.loading}>Loading Photo...</p>; // Translated
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
                    {id ? "Edit User" : "Create New Admin"} {/* Translated */}
                </h2>
                <div style={styles.form}>
                    <form onSubmit={handleSubmit}>
                        {id && (
                            <div style={styles.photoContainer}>
                                <img
                                    src={currentPhotoUrl}
                                    alt="Profile" // Translated
                                    style={styles.photo}
                                    // 4. onError handler'ında da yerel varsayılanı kullanın
                                    onError={(e) => {
                                        e.target.onerror = null; // Sonsuz döngüyü önlemek için
                                        e.target.src = defaultUserPhoto; // Yerel görsel de yüklenemezse (nadiren olur)
                                        console.error("Could not load image, using default."); // Hata logu
                                    }}
                                />
                            </div>
                        )}
                        <div style={styles.formGroup}>
                            <label htmlFor="username" style={styles.label}>
                                Username: {/* Translated */}
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Enter username" // Translated
                                style={styles.input}
                                required
                                maxLength={16}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="address" style={styles.label}>
                                Address: {/* Translated */}
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter address" // Translated
                                style={styles.input}
                                required
                                maxLength={100}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="phone" style={styles.label}>
                                Phone: {/* Translated */}
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
                                    Password: {/* Translated */}
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter password" // Translated
                                    style={styles.input}
                                    required
                                />
                            </div>
                        )}
                        {id && (
                            <div style={styles.formGroup}>
                                <label htmlFor="role" style={styles.label}>
                                    Role: {/* Translated */}
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    style={styles.select}
                                    disabled // Rolü düzenleme formu üzerinden değiştirmeyi kısıtladık
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
                            {id ? "Update" : "Create"} {/* Translated */}
                        </button>
                    </form>
                </div>
            </div>
            {successMessage && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <p style={styles.modalMessage}>{successMessage}</p>
                        <button onClick={handleModalClose} style={styles.modalButton}>
                            OK {/* Translated */}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserForm;