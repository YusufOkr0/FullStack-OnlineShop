import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import api from "../../services/api";
import ErrorComponent from "../ErrorComponent";
import styles from "../../components/css/Products/ProductFormStyle";

const ProductForm = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
        reset,
    } = useForm();
    const [photo, setPhoto] = useState(null);
    const [currentPhotoUrl, setCurrentPhotoUrl] = useState(null);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (id) {
            console.log("Fetching product with ID:", id);
            const fetchProductData = async () => {
                try {
                    const response = await api.get(`/products/${id}`);
                    const product = response.data;
                    console.log("Product data:", product);
                    setValue("name", product.name || "");
                    setValue("supplier", product.supplier || "");
                    setValue("price", product.price || 0);
                } catch (err) {
                    setError({
                        status: err.response?.status || null,
                        message:
                            err.response?.data?.message || "Failed to load product data.",
                        errorMessage: err.response?.data?.error || "An Error Occurred",
                    });
                    console.error("Fetch product error:", err);
                }
            };

            const fetchPhoto = async () => {
                setPhotoLoading(true);
                try {
                    const response = await api.get(`/products/${id}/image`, {
                        responseType: "blob",
                    });
                    const imageUrl = URL.createObjectURL(response.data);
                    setCurrentPhotoUrl(imageUrl);
                } catch (err) {
                    console.error("Photo fetch error:", err);
                    setCurrentPhotoUrl(null);
                } finally {
                    setPhotoLoading(false);
                }
            };

            const loadData = async () => {
                setLoading(true);
                await Promise.all([fetchProductData(), fetchPhoto()]);
                setLoading(false);
            };

            loadData();
        } else {
            reset({
                name: "",
                supplier: "",
                price: "",
            });
            setCurrentPhotoUrl(null);
        }

        return () => {
            if (currentPhotoUrl) {
                URL.revokeObjectURL(currentPhotoUrl);
            }
        };
    }, [id, setValue, reset]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
                console.log("Navigating to /products from modal timeout");
                navigate("/products", {replace: true});
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, navigate]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setCurrentPhotoUrl(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        setSuccessMessage("");
        console.log("Submitting form with data:", data);
        try {
            const formData = new FormData();
            const productRequest = {
                name: data.name,
                supplier: data.supplier,
                price: data.price,
            };
            formData.append(
                id ? "updateProductRequest" : "addProductRequest",
                new Blob([JSON.stringify(productRequest)], {
                    type: "application/json",
                })
            );
            if (photo) {
                formData.append("file", photo);
            }

            for (let [key, value] of formData.entries()) {
                console.log(`FormData: ${key} =`, value);
            }

            let response;
            if (id) {
                console.log(`Sending PUT request to /products/updateById/${id}`);
                response = await api.put(`/products/updateById/${id}`, formData, {
                    headers: {"Content-Type": "multipart/form-data"},
                });
            } else {
                console.log("Sending POST request to /products/add");
                response = await api.post("/products/add", formData, {
                    headers: {"Content-Type": "multipart/form-data"},
                });
            }
            setSuccessMessage(
                response.data?.message ||
                (id ? "Product updated successfully!" : "Product added successfully!")
            );
        } catch (err) {
            setError({
                status: err.response?.status || null,
                message:
                    err.response?.data?.message || "An error occurred while saving the product.",
                errorMessage: err.response?.data?.error || "An Error Occurred",
            });
            console.error("Submit error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div style={styles.container}>
                <h2 style={styles.title}>{id ? "Edit Product" : "Add New Product"}</h2>
                <div style={styles.form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div style={styles.photoContainer}>
                            {currentPhotoUrl ? (
                                <img src={currentPhotoUrl} alt="Ürün" style={styles.photo}/>
                            ) : (
                                <div style={styles.placeholder} aria-label="Ürün resmi yok">
                                    <svg
                                        style={styles.placeholderSvg}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M7 16L8 14L10 16L13 13L17 17"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                style={styles.photoInput}
                                id="photo-upload"
                            />
                            <label htmlFor="photo-upload" style={styles.photoButton}>
                                Upload Photo
                            </label>
                        </div>

                        <div style={styles.formGroup}>
                            <label htmlFor="name" style={styles.label}>
                                Product Name:
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter Product Name"
                                style={styles.input}
                                {...register("name", {required: "Product name is required"})}
                            />
                            {errors.name && (
                                <span style={styles.errorMessage}>{errors.name.message}</span>
                            )}
                        </div>

                        <div style={styles.formGroup}>
                            <label htmlFor="supplier" style={styles.label}>
                                Supplier:
                            </label>
                            <input
                                id="supplier"
                                type="text"
                                placeholder="Enter Supplier Name"
                                style={styles.input}
                                {...register("supplier", {required: "Supplier is required"})}
                            />
                            {errors.supplier && (
                                <span style={styles.errorMessage}>
                  {errors.supplier.message}
                </span>
                            )}
                        </div>

                        <div style={styles.formGroup}>
                            <label htmlFor="price" style={styles.label}>
                                Price:
                            </label>
                            <input
                                id="price"
                                type="number"
                                step="0.01"
                                placeholder="Enter Product Price"
                                style={styles.input}
                                {...register("price", {
                                    required: "Price is required",
                                    min: {value: 0, message: "Price Cannot Be Negative"},
                                    valueAsNumber: true,
                                })}
                            />
                            {errors.price && (
                                <span style={styles.errorMessage}>{errors.price.message}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            style={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : id ? "Update" : "Add"}
                        </button>
                    </form>
                </div>
            </div>
            {successMessage && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <p style={styles.modalMessage}>{successMessage}</p>
                        <button onClick={handleModalClose} style={styles.modalButton}>
                            Okey
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductForm;
