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
    fontFamily: "'Inter', sans-serif",
    marginBottom: isMobile ? "15px" : "0",
  },
  addButton: {
    padding: isMobile ? "10px 20px" : "12px 24px",
    backgroundColor: "#5a67d8",
    color: "#ffffff",
    fontSize: isMobile ? "14px" : "16px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    textDecoration: "none",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  cards: {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    flexWrap: "wrap",
    gap: isMobile ? "20px" : "30px",
    justifyContent: "center",
    width: "100%",
    maxWidth: "1200px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
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
  cardTitle: {
    fontSize: isMobile ? "20px" : "24px",
    color: "#1a202c",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    marginBottom: "10px",
  },
  cardText: {
    fontSize: isMobile ? "14px" : "16px",
    color: "#4a5568",
    fontWeight: "400",
    fontFamily: "'Inter', sans-serif",
    marginBottom: "10px",
  },
  cardActions: {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "10px" : "15px",
    justifyContent: "center",
    marginTop: "15px",
  },
  actionButton: {
    padding: isMobile ? "8px 16px" : "10px 20px",
    fontSize: isMobile ? "14px" : "16px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    textDecoration: "none",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: "#ffffff",
  },
  detailButton: {
    backgroundColor: "#5a67d8",
  },
  updateButton: {
    backgroundColor: "#f6ad55",
  },
  deleteButton: {
    backgroundColor: "#f56565",
  },
  loading: {
    textAlign: "center",
    fontSize: isMobile ? "16px" : "18px",
    color: "#4a5568",
    marginTop: "50px",
    animation: "fadeIn 0.5s ease-in-out",
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
    animation: "fadeIn 0.3s ease-in-out",
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: isMobile ? "20px" : "30px",
    maxWidth: isMobile ? "90%" : "400px",
    width: "100%",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    fontFamily: "'Inter', sans-serif",
    animation: "fadeIn 0.3s ease-in-out",
  },
  modalTitle: {
    fontSize: isMobile ? "20px" : "24px",
    color: "#1a202c",
    fontWeight: "600",
    marginBottom: "15px",
  },
  modalText: {
    fontSize: isMobile ? "14px" : "16px",
    color: "#4a5568",
    marginBottom: "20px",
  },
  modalButtons: {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "10px" : "15px",
    justifyContent: "center",
  },
  modalButton: {
    padding: isMobile ? "8px 16px" : "10px 20px",
    fontSize: isMobile ? "14px" : "16px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: "#ffffff",
  },
  confirmButton: {
    backgroundColor: "#f56565",
  },
  cancelButton: {
    backgroundColor: "#5a67d8",
  },
};

styles.addButton[":hover"] = {
  backgroundColor: "#4c51bf",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
};
styles.addButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};
styles.detailButton[":hover"] = {
  backgroundColor: "#4c51bf",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
};
styles.detailButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};
styles.updateButton[":hover"] = {
  backgroundColor: "#ed9b40",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(246, 173, 85, 0.3)",
};
styles.updateButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};
styles.deleteButton[":hover"] = {
  backgroundColor: "#e53e3e",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(245, 101, 101, 0.3)",
};
styles.deleteButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};
styles.confirmButton[":hover"] = {
  backgroundColor: "#e53e3e",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(245, 101, 101, 0.3)",
};
styles.confirmButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};
styles.cancelButton[":hover"] = {
  backgroundColor: "#4c51bf",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(90, 103, 216, 0.3)",
};
styles.cancelButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};

export default styles;
