const isMobile = window.innerWidth <= 768; // Simple mobile detection
const styles = {
  container: {
    minHeight: "100vh", // Full viewport height
    width: "100%",
    background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)", // Same gradient as Login/Signup
    padding: isMobile ? "20px" : "40px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    textAlign: "center",
    marginBottom: isMobile ? "30px" : "50px",
    animation: "fadeIn 0.5s ease-in-out",
  },
  headerH1: {
    fontSize: isMobile ? "28px" : "36px",
    color: "#1a202c",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    marginBottom: "15px",
  },
  headerP: {
    fontSize: isMobile ? "16px" : "18px",
    color: "#4a5568",
    fontWeight: "400",
    fontFamily: "'Inter', sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
  },
  content: {
    width: "100%",
    maxWidth: "1200px",
    textAlign: "center",
  },
  contentH2: {
    fontSize: isMobile ? "24px" : "32px",
    color: "#1a202c",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    marginBottom: isMobile ? "20px" : "30px",
  },
  cards: {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "20px" : "30px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)", // Same shadow as Login/Signup
    padding: isMobile ? "20px" : "30px",
    width: isMobile ? "100%" : "300px",
    textAlign: "center",
    transition: "all 0.3s ease",
    animation: "fadeIn 0.5s ease-in-out",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
  },
  cardH3: {
    fontSize: isMobile ? "20px" : "24px",
    color: "#1a202c",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    marginBottom: "15px",
  },
  cardP: {
    fontSize: isMobile ? "14px" : "16px",
    color: "#4a5568",
    fontWeight: "400",
    fontFamily: "'Inter', sans-serif",
    marginBottom: "20px",
  },
  cardLink: {
    display: "inline-block",
    padding: isMobile ? "10px 20px" : "12px 24px",
    backgroundColor: "#5a67d8", // Same indigo as buttons
    color: "#ffffff",
    fontSize: isMobile ? "14px" : "16px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    textDecoration: "none",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  },
  cardLinkHover: {
    backgroundColor: "#4c51bf",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
  },
  cardLinkActive: {
    transform: "translateY(0)",
    boxShadow: "none",
  },
};

export default styles;
