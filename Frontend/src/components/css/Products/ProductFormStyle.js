const isMobile = window.innerWidth <= 768;
const styles = {
  container: {
    minHeight: "calc(100vh - 60px)",
    width: "100%",
    background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)",
    padding: isMobile ? "20px" : "40px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Inter', sans-serif",
  },
  title: {
    fontSize: isMobile ? "28px" : "36px",
    color: "#1a202c",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    marginBottom: isMobile ? "20px" : "30px",
    textAlign: "center",
    animation: "fadeIn 0.5s ease-in-out",
  },
  form: {
    maxWidth: "600px",
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    padding: isMobile ? "20px" : "30px",
    animation: "fadeIn 0.5s ease-in-out",
  },
  photoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: isMobile ? "15px" : "20px",
  },
  photo: {
    width: isMobile ? "120px" : "150px",
    height: isMobile ? "120px" : "150px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
    border: "2px solid #dee2e6",
    backgroundColor: "#f8f9fa",
    transition: "transform 0.3s ease",
  },
  placeholder: {
    width: isMobile ? "120px" : "150px",
    height: isMobile ? "120px" : "150px",
    borderRadius: "50%",
    backgroundColor: "#f8f9fa",
    border: "2px solid #dee2e6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10px",
    transition: "transform 0.3s ease",
  },
  placeholderSvg: {
    width: isMobile ? "60px" : "80px",
    height: isMobile ? "60px" : "80px",
    fill: "#4a5568",
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
    marginBottom: isMobile ? "15px" : "20px",
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
  submitButton: {
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
    width: "100%",
    marginTop: "20px",
  },
  errorMessage: {
    color: "#f56565",
    fontSize: isMobile ? "12px" : "14px",
    fontFamily: "'Inter', sans-serif",
    marginTop: "5px",
    display: "block",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: isMobile ? "20px" : "30px",
    maxWidth: isMobile ? "90%" : "400px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    animation: "modalFadeIn 0.3s ease-in-out",
  },
  modalMessage: {
    fontSize: isMobile ? "16px" : "18px",
    color: "#28a745",
    marginBottom: "20px",
    fontFamily: "'Inter', sans-serif",
  },
  modalButton: {
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
};

styles.photo[":hover"] = {
  transform: "scale(1.05)",
};
styles.placeholder[":hover"] = {
  transform: "scale(1.05)",
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
styles.input[":focus"] = {
  borderColor: "#5a67d8",
  boxShadow: "0 0 0 3px rgba(90, 103, 216, 0.1)",
};
styles.submitButton[":hover"] = {
  backgroundColor: "#4c51bf",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
};
styles.submitButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};
styles.submitButton[":disabled"] = {
  backgroundColor: "#a0aec0",
  cursor: "not-allowed",
  transform: "none",
  boxShadow: "none",
};
styles.modalButton[":hover"] = {
  backgroundColor: "#4c51bf",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
};
styles.modalButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};

export default styles;
