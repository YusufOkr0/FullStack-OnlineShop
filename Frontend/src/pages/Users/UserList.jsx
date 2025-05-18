import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ErrorComponent from "../ErrorComponent";
// Import the userListStyle object - assumed to contain styles
import styles from "../../components/css/Users/userListStyle";

const UserList = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // State for PDF generation
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [reportError, setReportError] = useState(null);

    // Effect to fetch users
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await api.get("/customers");
                setUsers(userResponse.data);
            } catch (err) {
                setError({
                    status: err.response?.status || null,
                    message: err.response?.data?.message || "Could not load users.", // Translated
                    errorMessage: err.response?.data?.error || "An Error Occurred", // Translated
                });
                console.error("Fetch users error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once on mount

    // --- Delete Modal Logic ---
    const openDeleteModal = (id) => {
        setSelectedUserId(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUserId(null);
        // Clear potential deletion error when closing modal
        if (error && error.source === 'delete') {
            setError(null);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/customers/deleteById/${selectedUserId}`);
            setUsers(users.filter((user) => user.id !== selectedUserId));
            closeModal();
        } catch (err) {
            setError({
                status: err.response?.status || null,
                message:
                    err.response?.data?.message || "An error occurred while deleting the user.", // Translated
                errorMessage: err.response?.data?.error || "An Error Occurred", // Translated
                source: 'delete' // Add a source to distinguish from fetch error
            });
            console.error("Delete user error:", err);
            // Keep modal open to show the deletion error, or close it and show elsewhere
            // Let's close it and rely on the main error display for simplicity
            // closeModal(); // Or handle error display within the modal
        } finally {
            // If error display is outside modal, always close
            if (!error || error.source !== 'delete') { // Only close if no delete error is set right before
                closeModal();
            }
        }
    };
    // --- End Delete Modal Logic ---


    // --- Report Generation Logic ---
    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        setReportError(null); // Clear previous errors

        try {
            const response = await api.get("/customers/report", {
                responseType: "blob", // Crucial for binary data like PDF
            });

            // Extract filename from Content-Disposition header if available
            const contentDisposition = response.headers["content-disposition"];
            let filename = "users_report.pdf"; // Default filename
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            // Create a temporary URL for the blob data
            const url = URL.createObjectURL(new Blob([response.data]));

            // Create a temporary link element to trigger the download
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename); // Set the filename for download

            // Append the link to the body and click it
            document.body.appendChild(link);
            link.click();

            // Clean up the temporary link and revoke the object URL
            document.body.removeChild(link);
            // Revoke the URL after a small delay to allow download to start
            setTimeout(() => URL.revokeObjectURL(url), 100);

        } catch (err) {
            console.error("Generate report error:", err);
            // Attempt to read error message if response is not a blob (e.g., JSON error)
            if (err.response && err.response.data instanceof Blob) {
                // If it's a blob, try reading it as text
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const errorJson = JSON.parse(reader.result);
                        setReportError(errorJson.message || "An error occurred while generating the report.");
                    } catch (parseErr) {
                        setReportError("An unexpected error occurred while generating the report.");
                    }
                };
                reader.readAsText(err.response.data);
            } else {
                setReportError(err.response?.data?.message || "An error occurred while generating the report.");
            }

        } finally {
            setIsGeneratingReport(false);
        }
    };
    // --- End Report Generation Logic ---


    // Effect for CSS animations (remains unchanged)
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      /* Add modal fade in animation if you have a modal style */
      @keyframes modalFadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
        document.head.appendChild(styleSheet);
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []); // Empty dependency array means this effect runs once on mount

    // Render loading state
    if (loading) return <p style={styles.loading}>Loading...</p>; // Translated

    // Render main error component if a general fetch error occurred
    if (error && error.source !== 'delete') // Only show main error if it's not a delete error handled by modal (if you change modal logic)
        return (
            <ErrorComponent
                status={error.status}
                message={error.message}
                error={error.errorMessage}
            />
        );

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>User List</h2> {/* Translated */}
                {user?.role === "ADMIN" && (
                    <div style={{ display: 'flex', gap: '10px' }}> {/* Optional: Add a div to space buttons */}
                        <Link to="/users/add">
                            <button style={styles.addButton}>Add User</button> {/* Changed button text to be more general */}
                        </Link>
                        {/* Button to generate PDF report */}
                        <button
                            style={{...styles.addButton, backgroundColor: '#28a745'}} // Example style: Green button
                            onClick={handleGenerateReport}
                            disabled={isGeneratingReport}
                        >
                            {isGeneratingReport ? "Generating..." : "Generate PDF Report"} {/* Translated loading/button text */}
                        </button>
                    </div>
                )}
            </div>

            {/* Display report specific error if it exists */}
            {reportError && (
                <p style={{ color: 'red', marginTop: '10px' }}>{reportError}</p> // Simple error display
            )}
            {/* Display deletion error below header if you chose to close modal on error */}
            {error && error.source === 'delete' && (
                <p style={{ color: 'red', marginTop: '10px' }}>{error.message}</p>
            )}


            <div style={styles.cards}>
                {users.length > 0 ? (
                    users.map((user) => (
                        <div
                            key={user.id}
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
                            <h3 style={styles.cardTitle}>{user.username}</h3>
                            <p style={styles.cardText}>
                                <strong>Phone:</strong> {user.phone} {/* Translated */}
                            </p>
                            <p style={styles.cardText}>
                                <strong>Role:</strong> {user.role} {/* Translated */}
                            </p>
                            <div style={styles.cardActions}>
                                <Link
                                    to={`/users/${user.id}`}
                                    style={{ ...styles.actionButton, ...styles.detailButton }}
                                    onMouseOver={(e) => Object.assign(e.target.style, styles.detailButton[":hover"])}
                                    onMouseOut={(e) => Object.assign(e.target.style, { backgroundColor: styles.detailButton.backgroundColor, transform: "none", boxShadow: "none"})}
                                    onMouseDown={(e) => Object.assign(e.target.style, styles.detailButton[":active"])}
                                    onMouseUp={(e) => Object.assign(e.target.style, { transform: "translateY(-2px)"})}
                                >
                                    Details {/* Translated */}
                                </Link>
                                {user?.role === "ADMIN" && (
                                    <>
                                        <Link
                                            to={`/users/${user.id}/edit`}
                                            style={{ ...styles.actionButton, ...styles.updateButton }}
                                            onMouseOver={(e) => Object.assign(e.target.style, styles.updateButton[":hover"])}
                                            onMouseOut={(e) => Object.assign(e.target.style, { backgroundColor: styles.updateButton.backgroundColor, transform: "none", boxShadow: "none"})}
                                            onMouseDown={(e) => Object.assign(e.target.style, styles.updateButton[":active"])}
                                            onMouseUp={(e) => Object.assign(e.target.style, { transform: "translateY(-2px)"})}
                                        >
                                            Update {/* Translated */}
                                        </Link>
                                        <button
                                            style={{ ...styles.actionButton, ...styles.deleteButton }}
                                            onClick={() => openDeleteModal(user.id)}
                                            onMouseOver={(e) => Object.assign(e.target.style, styles.deleteButton[":hover"])}
                                            onMouseOut={(e) => Object.assign(e.target.style, { backgroundColor: styles.deleteButton.backgroundColor, transform: "none", boxShadow: "none"})}
                                            onMouseDown={(e) => Object.assign(e.target.style, styles.deleteButton[":active"])}
                                            onMouseUp={(e) => Object.assign(e.target.style, { transform: "translateY(-2px)"})}
                                        >
                                            Delete {/* Translated */}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={styles.loading}>No users found.</p> // Translated
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Delete User</h3> {/* Translated */}
                        <p style={styles.modalText}>
                            Are you sure you want to delete this user? This action cannot be
                            undone. {/* Translated */}
                        </p>
                        {/* Optional: Display delete specific error inside modal */}
                        {/* {error && error.source === 'delete' && (
                <p style={{ color: 'red', marginBottom: '10px' }}>{error.message}</p>
             )} */}
                        <div style={styles.modalButtons}>
                            <button
                                style={{ ...styles.modalButton, ...styles.confirmButton }}
                                onClick={handleDelete}
                                onMouseOver={(e) => Object.assign(e.target.style, styles.confirmButton[":hover"])}
                                onMouseOut={(e) => Object.assign(e.target.style, { backgroundColor: styles.confirmButton.backgroundColor, transform: "none", boxShadow: "none"})}
                                onMouseDown={(e) => Object.assign(e.target.style, styles.confirmButton[":active"])}
                                onMouseUp={(e) => Object.assign(e.target.style, { transform: "translateY(-2px)"})}
                            >
                                Yes, Delete {/* Translated */}
                            </button>
                            <button
                                style={{ ...styles.modalButton, ...styles.cancelButton }}
                                onClick={closeModal}
                                onMouseOver={(e) => Object.assign(e.target.style, styles.cancelButton[":hover"])}
                                onMouseOut={(e) => Object.assign(e.target.style, { backgroundColor: styles.cancelButton.backgroundColor, transform: "none", boxShadow: "none"})}
                                onMouseDown={(e) => Object.assign(e.target.style, styles.cancelButton[":active"])}
                                onMouseUp={(e) => Object.assign(e.target.style, { transform: "translateY(-2px)"})}
                            >
                                Cancel {/* Translated */}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;