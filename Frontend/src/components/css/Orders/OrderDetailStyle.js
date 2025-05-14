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
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "space-between",
    alignItems: isMobile ? "flex-start" : "center",
    width: "100%",
    maxWidth: "1200px",
    marginBottom: isMobile ? "20px" : "30px",
    animation: "fadeIn 0.5s ease-in-out",
  },
  title: {
    fontSize: isMobile ? "28px" : "36px",
    color: "#1a202c",
    fontWeight: "700",
    marginBottom: isMobile ? "15px" : "0",
  },
  backButton: {
    padding: isMobile ? "10px 20px" : "12px 24px",
    backgroundColor: "#5a67d8",
    color: "#ffffff",
    fontSize: isMobile ? "14px" : "16px",
    fontWeight: "600",
    textDecoration: "none",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    padding: isMobile ? "20px" : "30px",
    width: "100%",
    maxWidth: "600px",
    animation: "fadeIn 0.5s ease-in-out",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isMobile ? "10px 0" : "12px 0",
    borderBottom: "1px solid #e2e8f0",
    fontSize: isMobile ? "14px" : "16px",
    color: "#4a5568",
  },
  infoLabel: {
    fontWeight: "600",
    color: "#1a202c",
    flex: "1",
  },
  infoValue: {
    flex: "2",
    textAlign: "right",
  },
  loading: {
    textAlign: "center",
    fontSize: isMobile ? "16px" : "18px",
    color: "#4a5568",
    marginTop: "50px",
    animation: "fadeIn 0.5s ease-in-out",
  },
  empty: {
    textAlign: "center",
    fontSize: isMobile ? "16px" : "18px",
    color: "#4a5568",
    marginTop: "50px",
    animation: "fadeIn 0.5s ease-in-out",
  },
};

styles.backButton[":hover"] = {
  backgroundColor: "#4c51bf",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
};
styles.backButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};

export default styles;
