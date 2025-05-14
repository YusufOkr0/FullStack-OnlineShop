const isMobile = window.innerWidth <= 768;
const styles = {
  container: {
    minHeight: "calc(100vh - 60px)",
    width: "100%",
    background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)",
    padding: isMobile ? "20px" : "40px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    maxWidth: "1000px",
    width: "100%",
    minHeight: isMobile ? "400px" : "500px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    animation: "fadeIn 0.5s ease-in-out",
  },
  imageContainer: {
    flex: "1",
    padding: isMobile ? "25px" : "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  image: {
    maxWidth: "100%",
    maxHeight: isMobile ? "250px" : "300px",
    objectFit: "contain",
    borderRadius: "8px",
    transition: "transform 0.3s ease",
  },
  detailsContainer: {
    flex: "1",
    padding: isMobile ? "25px" : "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    fontSize: isMobile ? "20px" : "24px",
    fontWeight: "600",
    color: "#1a202c",
    marginBottom: "15px",
  },
  supplier: {
    fontSize: isMobile ? "14px" : "16px",
    color: "#4a5568",
    marginBottom: "15px",
  },
  price: {
    fontSize: isMobile ? "16px" : "18px",
    fontWeight: "500",
    color: "#5a67d8",
    marginBottom: isMobile ? "20px" : "25px",
  },
  button: {
    width: "100%",
    padding: isMobile ? "10px" : "12px",
    backgroundColor: "#5a67d8",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: isMobile ? "14px" : "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  message: {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: isMobile ? "14px" : "16px",
    textAlign: "center",
    fontFamily: "'Inter', sans-serif",
    animation: "fadeIn 0.5s ease-in-out",
  },
  successMessage: {
    backgroundColor: "#c6f6d5",
    color: "#28a745",
  },
  errorMessage: {
    backgroundColor: "#fed7d7",
    color: "#f56565",
  },
  loading: {
    textAlign: "center",
    fontSize: isMobile ? "16px" : "18px",
    color: "#4a5568",
    marginTop: "50px",
    animation: "fadeIn 0.5s ease-in-out",
  },
  notFound: {
    textAlign: "center",
    fontSize: isMobile ? "16px" : "18px",
    color: "#4a5568",
    padding: isMobile ? "15px" : "20px",
    animation: "fadeIn 0.5s ease-in-out",
  },
};

styles.image[":hover"] = {
  transform: "scale(1.05)",
};
styles.button[":hover"] = {
  backgroundColor: "#4c51bf",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
};
styles.button[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};

export default styles;
