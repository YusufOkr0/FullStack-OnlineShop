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
    position: "relative",
    top: 0,
    overflow: "hidden",
  },
  title: {
    fontSize: isMobile ? "28px" : "36px",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: isMobile ? "20px" : "30px",
    textAlign: "center",
    animation: "fadeIn 0.5s ease-in-out",
  },
  card: {
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
    justifyContent: "center",
    marginBottom: isMobile ? "15px" : "20px",
  },
  photo: {
    width: isMobile ? "120px" : "150px",
    height: isMobile ? "120px" : "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #dee2e6",
    backgroundColor: "#f8f9fa",
    transition: "transform 0.3s ease",
  },
  detailGroup: {
    marginBottom: isMobile ? "15px" : "20px",
  },
  label: {
    fontSize: isMobile ? "14px" : "16px",
    fontWeight: "600",
    color: "#1a202c",
    marginBottom: "8px",
    display: "block",
  },
  value: {
    fontSize: isMobile ? "14px" : "16px",
    color: "#4a5568",
    backgroundColor: "#f8f9fa",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #dee2e6",
  },
  loading: {
    textAlign: "center",
    fontSize: isMobile ? "16px" : "18px",
    color: "#4a5568",
    marginTop: "50px",
    animation: "fadeIn 0.5s ease-in-out",
  },
};

styles.photo[":hover"] = {
  transform: "scale(1.05)",
};

export default styles;
