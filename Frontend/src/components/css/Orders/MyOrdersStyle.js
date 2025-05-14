const isMobile = window.innerWidth <= 768;

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #e0e7ff 0%, #f4f7fc 100%)",
    padding: isMobile ? "16px" : "24px",
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
    maxWidth: "1280px",
    marginBottom: isMobile ? "16px" : "24px",
    animation: "fadeIn 0.5s ease-in-out",
  },
  title: {
    fontSize: isMobile ? "24px" : "32px",
    color: "#111827",
    fontWeight: "700",
    marginBottom: isMobile ? "12px" : "0",
    letterSpacing: "-0.5px",
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    padding: isMobile ? "16px" : "24px",
    width: "100%",
    maxWidth: "1280px",
    animation: "fadeIn 0.5s ease-in-out",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: isMobile ? "14px" : "15px",
  },
  tableHeader: {
    backgroundColor: "#f9fafb",
    color: "#111827",
    fontWeight: "600",
    textAlign: "left",
    padding: isMobile ? "8px" : "10px",
    borderBottom: "1px solid #e5e7eb",
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background-color 0.2s ease",
  },
  tableCell: {
    padding: isMobile ? "8px" : "10px",
    color: "#374151",
    verticalAlign: "middle",
  },
  actionButton: {
    padding: isMobile ? "6px 12px" : "8px 16px",
    fontSize: isMobile ? "13px" : "14px",
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
    textDecoration: "none",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    color: "#ffffff",
    margin: isMobile ? "4px 0" : "0 4px",
  },
  detailButton: {
    background: "linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)",
  },
  deleteButton: {
    background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
  },
  receiptButton: {
    background: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
  },
  loading: {
    textAlign: "center",
    fontSize: isMobile ? "14px" : "16px",
    color: "#374151",
    marginTop: "40px",
    animation: "fadeIn 0.5s ease-in-out",
  },
  empty: {
    textAlign: "center",
    fontSize: isMobile ? "14px" : "16px",
    color: "#374151",
    marginTop: "40px",
    animation: "fadeIn 0.5s ease-in-out",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(3px)",
    WebkitBackdropFilter: "blur(3px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    animation: "fadeInOverlay 0.3s ease-in-out",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: isMobile ? "16px" : "24px",
    width: isMobile ? "90%" : "800px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
    animation: "slideIn 0.3s ease-in-out",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "16px" : "24px",
    position: "relative",
  },
  modalContentSmall: {
    width: isMobile ? "90%" : "400px",
    display: "block",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: isMobile ? "12px" : "16px",
    right: isMobile ? "12px" : "16px",
    backgroundColor: "#e5e7eb",
    border: "none",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "16px",
    cursor: "pointer",
    color: "#374151",
    transition: "all 0.2s ease",
  },
  modalImageContainer: {
    flex: isMobile ? "none" : "0 0 280px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: isMobile ? "100%" : "280px",
    height: isMobile ? "200px" : "280px",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  modalImage: {
    width: isMobile ? "100%" : "260px",
    height: isMobile ? "auto" : "260px",
    objectFit: "contain",
    borderRadius: "8px",
    transition: "transform 0.3s ease",
  },
  modalInfoContainer: {
    flex: isMobile ? "none" : "1",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  modalTitle: {
    fontSize: isMobile ? "20px" : "24px",
    color: "#111827",
    fontWeight: "700",
    marginBottom: "12px",
    letterSpacing: "-0.5px",
  },
  modalText: {
    fontSize: isMobile ? "14px" : "16px",
    color: "#374151",
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
    transition: "all 0.2s ease",
    color: "#ffffff",
  },
  confirmButton: {
    background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
  },
  cancelButton: {
    background: "linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)",
  },
};

styles.detailButton[":hover"] = {
  background: "linear-gradient(135deg, #4338ca 0%, #5b21b6 100%)",
  transform: "translateY(-1px)",
  boxShadow: "0 3px 8px rgba(79, 70, 229, 0.3)",
};
styles.detailButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};
styles.deleteButton[":hover"] = {
  background: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
  transform: "translateY(-1px)",
  boxShadow: "0 3px 8px rgba(220, 38, 38, 0.3)",
};
styles.deleteButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};
styles.receiptButton[":hover"] = {
  background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
  transform: "translateY(-1px)",
  boxShadow: "0 3px 8px rgba(234, 179, 8, 0.3)",
};
styles.receiptButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};
styles.confirmButton[":hover"] = {
  background: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
  transform: "translateY(-1px)",
  boxShadow: "0 3px 8px rgba(220, 38, 38, 0.3)",
};
styles.confirmButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};
styles.cancelButton[":hover"] = {
  background: "linear-gradient(135deg, #4338ca 0%, #5b21b6 100%)",
  transform: "translateY(-1px)",
  boxShadow: "0 3px 8px rgba(79, 70, 229, 0.3)",
};
styles.cancelButton[":active"] = {
  transform: "translateY(0)",
  boxShadow: "none",
};
styles.tableRow[":hover"] = {
  backgroundColor: "#f9fafb",
};
styles.closeButton[":hover"] = {
  backgroundColor: "#d1d5db",
  color: "#111827",
};
styles.modalImage[":hover"] = {
  transform: "scale(1.03)",
};

export default styles;
