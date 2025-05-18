const isMobile = window.innerWidth <= 768; // Simple mobile detection
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
        width: "100vw", // Full viewport width
        margin: 0,
        padding: isMobile ? "10px" : "20px",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)",
        overflow: "hidden", // Prevent any overflow
        boxSizing: "border-box",
    },
    formContainer: {
        width: isMobile ? "90%" : "100%", // Responsive width
        maxWidth: isMobile ? "none" : "420px", // Limit width on desktop
        padding: isMobile ? "20px" : "40px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        textAlign: "center",
        animation: "fadeIn 0.5s ease-in-out",
        boxSizing: "border-box",
    },
    header: {
        fontSize: isMobile ? "24px" : "32px", // Smaller header on mobile
        color: "#1a202c",
        marginBottom: isMobile ? "20px" : "30px",
        fontWeight: "700",
        fontFamily: "'Inter', sans-serif",
    },
    errorMessage: {
        color: "#f56565",
        fontSize: isMobile ? "12px" : "14px",
        marginBottom: isMobile ? "15px" : "20px",
        fontWeight: "500",
        backgroundColor: "#fff5f5",
        padding: "10px",
        borderRadius: "6px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    inputGroup: {
        marginBottom: isMobile ? "16px" : "24px",
        textAlign: "left",
    },
    label: {
        fontSize: isMobile ? "13px" : "15px",
        color: "#4a5568",
        marginBottom: "10px",
        fontWeight: "600",
        fontFamily: "'Inter', sans-serif",
    },
    input: {
        padding: isMobile ? "12px 14px" : "14px 16px",
        fontSize: isMobile ? "14px" : "16px",
        color: "#2d3748",
        backgroundColor: "#f7fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        width: "100%",
        transition: "all 0.3s ease",
        fontFamily: "'Inter', sans-serif",
        boxSizing: "border-box",
    },
    inputFocus: {
        outline: "none",
        borderColor: "#5a67d8",
        boxShadow: "0 0 0 3px rgba(90, 103, 216, 0.2)",
        backgroundColor: "#ffffff",
    },
    button: {
        padding: isMobile ? "12px" : "16px",
        backgroundColor: "#5a67d8",
        color: "#ffffff",
        fontSize: isMobile ? "14px" : "16px",
        fontWeight: "600",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontFamily: "'Inter', sans-serif",
        marginTop: isMobile ? "5px" : "10px",
    },
    buttonHover: {
        backgroundColor: "#4c51bf",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
    },
    buttonActive: {
        transform: "translateY(0)",
        boxShadow: "none",
    },
    secondaryButton: {
        padding: isMobile ? "12px" : "16px",
        backgroundColor: "transparent",
        color: "#5a67d8",
        fontSize: isMobile ? "14px" : "16px",
        fontWeight: "600",
        border: "1px solid #5a67d8",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontFamily: "'Inter', sans-serif",
        marginTop: isMobile ? "10px" : "15px",
    },
    secondaryButtonHover: {
        backgroundColor: "#5a67d8",
        color: "#ffffff",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
    },
    secondaryButtonActive: {
        transform: "translateY(0)",
        boxShadow: "none",
    },
};

export default styles;