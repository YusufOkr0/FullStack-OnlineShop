// src/pages/About.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../components/css/Home/HomeStyle"; // Reusing Home styles for consistency

const About = () => {
  // Fade-in animation
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Team members data
  const teamMembers = [
    { name: "Murat Ali Alkan", number: "B221202003" },
    { name: "Erdoğan Bulut", number: "B221202021" },
    { name: "Yusuf Okur", number: "B221202045" },
    { name: "Gökdeniz Bayık", number: "B231202063" },
    { name: "Serhat Turgut", number: "B221202056" },
  ];
  const isMobile = window.innerWidth <= 768;
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerH1}>About Us</h1>
        <p style={styles.headerP}>
          Meet the team behind our project. We are a group of dedicated
          individuals working together to deliver innovative solutions.
        </p>
      </div>

      <div style={styles.content}>
        <h2 style={styles.contentH2}>Our Team</h2>
        <div style={styles.cards}>
          {teamMembers.map((member, index) => (
            <div
              key={index}
              style={styles.card}
              onMouseOver={(e) =>
                Object.assign(e.currentTarget.style, styles.cardHover)
              }
              onMouseOut={(e) =>
                Object.assign(e.currentTarget.style, {
                  transform: "none",
                  boxShadow: styles.card.boxShadow,
                })
              }
            >
              <h3 style={styles.cardH3}>{member.name}</h3>
              <p style={styles.cardP}>{member.number}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: isMobile ? "20px" : "30px" }}>
          <Link
            to="/"
            style={styles.cardLink}
            onMouseOver={(e) =>
              Object.assign(e.target.style, styles.cardLinkHover)
            }
            onMouseOut={(e) =>
              Object.assign(e.target.style, {
                backgroundColor: styles.cardLink.backgroundColor,
                transform: "none",
                boxShadow: "none",
              })
            }
            onMouseDown={(e) =>
              Object.assign(e.target.style, styles.cardLinkActive)
            }
            onMouseUp={(e) =>
              Object.assign(e.target.style, { transform: "translateY(-2px)" })
            }
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
