import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1>403</h1>
      <h2>Yetkilendirme Hatası</h2>
      <p>Bu sayfayı görüntülemek için yetkiniz yok.</p>
      <Link to="/login" className="go-login-button">
        Giriş Yap
      </Link>
    </div>
  );
};

export default Unauthorized;
