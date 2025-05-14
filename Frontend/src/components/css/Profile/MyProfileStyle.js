const isMobile = window.innerWidth <= 768;
const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)",
    padding: isMobile ? "20px" : "40px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    padding: isMobile ? "20px" : "30px",
    width: isMobile ? "100%" : "600px",
    textAlign: "center",
    transition: "all 0.3s ease",
    animation: "fadeIn 0.5s ease-in-out",
  },
  title: {
    fontSize: isMobile ? "28px" : "36px",
    color: "#1a202c",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    marginBottom: isMobile ? "20px" : "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  photoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  photo: {
    width: isMobile ? "120px" : "150px",
    height: isMobile ? "120px" : "150px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
    border: "2px solid #dee2e6",
    backgroundColor: "#f8f9fa",
  },
  photoInput: {
    display: "none",
  },
  photoButton: {
    padding: isMobile ? "8px 16px" : "10px 20px",
    backgroundColor: "#5a67d8",
    color: "#ffffff",
    fontSize: isMobile ? "14px" : "16px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  formGroup: {
    textAlign: "left",
  },
  label: {
    fontSize: isMobile ? "14px" : "16px",
    color: "#1a202c",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    marginBottom: "8px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: isMobile ? "8px" : "10px",
    fontSize: isMobile ? "14px" : "16px",
    fontFamily: "'Inter', sans-serif",
    border: "1px solid #dee2e6",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  updateButton: {
    padding: isMobile ? "10px 20px" : "12px 24px",
    backgroundColor: "#5a67d8",
    color: "#ffffff",
    fontSize: isMobile ? "14px" : "16px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  success: {
    textAlign: "center",
    fontSize: isMobile ? "14px" : "16px",
    color: "#28a745",
    marginBottom: "15px",
    animation: "fadeIn 0.5s ease-in-out",
  },
  loading: {
    textAlign: "center",
    fontSize: isMobile ? "16px" : "18px",
    color: "#4a5568",
    marginTop: "50px",
    animation: "fadeIn 0.5s ease-in-out",
  },
};

styles.photoButton[":hover"] = {
  backgroundColor: "#4c51bf",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
};
styles.photoButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};
styles.updateButton[":hover"] = {
  backgroundColor: "#4c51bf",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
};
styles.updateButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};
styles.input[":focus"] = {
  borderColor: "#5a67d8",
  boxShadow: "0 0 0 3px rgba(90, 103, 216, 0.1)",
};

export default styles;
